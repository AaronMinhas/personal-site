// Shared capture step for the recommendation image scripts: loads a page in
// headless Chrome and saves it as a WebP. The settings here define the one
// size and shape every recommendation image uses, so change them here, not
// per image, to keep the set consistent.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const VIEWPORT_WIDTH = 1232;
export const VIEWPORT_HEIGHT = 783;
const OUTPUT_WIDTH = 1800;
const COLOR_SCHEME = "dark";
const QUALITY = 82;
const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Saves `url` to public/images/software/<name>.webp after waiting `settleMs`. */
export async function capture(url, name, settleMs) {
  const port = 9300 + Math.floor(Math.random() * 400);
  const profile = mkdtempSync(join(tmpdir(), "capture-"));
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--hide-scrollbars",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    let target;
    for (let attempt = 0; attempt < 50 && !target; attempt++) {
      await sleep(200);
      try {
        const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
        target = pages.find((page) => page.type === "page");
      } catch {
        // Chrome is still starting.
      }
    }
    if (!target) throw new Error(`could not start Chrome at ${CHROME}`);

    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve) => (socket.onopen = resolve));
    let lastId = 0;
    const pending = new Map();
    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      pending.get(data.id)?.(data.result ?? {});
    };
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        pending.set(++lastId, resolve);
        socket.send(JSON.stringify({ id: lastId, method, params }));
      });

    await send("Emulation.setDeviceMetricsOverride", {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: OUTPUT_WIDTH / VIEWPORT_WIDTH,
      mobile: false,
    });
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: COLOR_SCHEME }],
    });
    await send("Page.navigate", { url });
    await sleep(settleMs);

    const { data } = await send("Page.captureScreenshot", {
      format: "webp",
      quality: QUALITY,
    });
    if (!data) throw new Error("Chrome returned no image");

    const out = join("public", "images", "software", `${name}.webp`);
    writeFileSync(out, Buffer.from(data, "base64"));
    console.log(`wrote ${out}`);
    socket.close();
  } finally {
    chrome.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  }
}

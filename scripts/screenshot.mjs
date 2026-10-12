// Takes a standardised screenshot of a web page for the recommendations page,
// so every modal image has the same framing, size and format.
//
//   npm run screenshot -- <url> <name>
//   npm run screenshot -- https://obsidian.md obsidian
//
// Writes public/images/software/<name>.webp. The settings below reproduce a
// desktop browser window at 80% zoom in dark mode; change them here, not per
// screenshot, to keep the set consistent.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const VIEWPORT_WIDTH = 1994;
const VIEWPORT_HEIGHT = 1268;
const OUTPUT_WIDTH = 1800;
const COLOR_SCHEME = "dark";
const SETTLE_MS = 3000;
const QUALITY = 82;
const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [url, name] = process.argv.slice(2);
if (!url || !name || !/^[a-z0-9-]+$/.test(name)) {
  console.error("usage: npm run screenshot -- <url> <lowercase-name>");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 9300 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "screenshot-"));
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
  await sleep(SETTLE_MS);

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

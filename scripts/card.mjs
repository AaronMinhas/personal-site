// Generates a title card for a recommendation that has no page worth
// capturing: the app's icon on a dark background with its name beneath, in
// the same size and shape as the screenshots.
//
//   npm run card -- <name> "<title>" <icon file>
//   npm run card -- deskflow "Deskflow" ~/Desktop/deskflow-icon.png
//
// Writes public/images/software/<name>.webp. The icon can be any image; a
// 512px PNG of the app's own icon looks best.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { capture, VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "./capture.mjs";

const [name, title, iconPath] = process.argv.slice(2);
if (!name || !title || !iconPath || !/^[a-z0-9-]+$/.test(name)) {
  console.error('usage: npm run card -- <lowercase-name> "<title>" <icon file>');
  process.exit(1);
}

const mimeTypes = { ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const mime = mimeTypes[extname(iconPath).toLowerCase()] ?? "image/png";
const icon = `data:${mime};base64,${readFileSync(iconPath).toString("base64")}`;
const font = pathToFileURL(
  resolve("public/fonts/jetbrains-mono/JetBrainsMono-SemiBold.woff2"),
).href;
const escapeHtml = (text) =>
  text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Deliberately plain: the icon and the name on the site's background, with no
// glow, gradient or shadow.
const html = `<!doctype html>
<meta charset="utf-8" />
<style>
  @font-face { font-family: "JetBrains Mono"; src: url("${font}") format("woff2"); font-weight: 600; }
  html, body { margin: 0; width: ${VIEWPORT_WIDTH}px; height: ${VIEWPORT_HEIGHT}px; overflow: hidden; background: #0f0f0f; }
  body { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 36px; }
  .icon { width: 208px; height: 208px; }
  h1 { margin: 0; font: 600 40px "JetBrains Mono", ui-monospace, monospace; letter-spacing: 0.01em; color: #e8e8e8; }
</style>
<img class="icon" src="${icon}" alt="" />
<h1>${escapeHtml(title)}</h1>
`;

const dir = mkdtempSync(join(tmpdir(), "card-"));
try {
  const page = join(dir, "card.html");
  writeFileSync(page, html);
  await capture(pathToFileURL(page).href, name, 1200);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

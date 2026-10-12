// Takes a standardised screenshot of a web page for the recommendations page,
// so every modal image has the same framing, size and format.
//
//   npm run screenshot -- <url> <name>
//   npm run screenshot -- https://obsidian.md obsidian
//
// Writes public/images/software/<name>.webp. The window is a narrow desktop
// one in dark mode, so page content appears large in the modal while sites
// still serve their desktop layout. For a tool with no page worth capturing,
// use `npm run card` instead.
import { capture } from "./capture.mjs";

// Long enough for slow pages to finish loading before the shot.
const SETTLE_MS = 5000;

const [url, name] = process.argv.slice(2);
if (!url || !name || !/^[a-z0-9-]+$/.test(name)) {
  console.error("usage: npm run screenshot -- <url> <lowercase-name>");
  process.exit(1);
}

await capture(url, name, SETTLE_MS);

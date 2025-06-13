import { build } from "bun";
import { mkdirSync, cpSync, rmSync } from "fs";
import { existsSync } from "fs";
import { join } from "path";

// 1. Clean dist folder
if (existsSync("dist")) {
  rmSync("dist", { recursive: true });
}
mkdirSync("dist");
mkdirSync("dist/js");

// 2. Bundle & minify all JS files in /js
const entryPoints = ["js/input.js", "js/cursor.js", "js/helpers.js", "js/render.js", "js/results.js", "js/typing.js"];

await build({
  entrypoints: entryPoints,
  outdir: "dist/js",
  minify: true,
  target: "browser",
});

// 3. Copy static assets
const staticFiles = [
  "index.html",
  "test.html",
  "tips.html",
  "results.html",
  "styles.css",
  "favicon.ico",
  "keyboard-typing-guide.png",
  "words.json",
];

for (const file of staticFiles) {
  cpSync(file, join("dist", file));
}

console.log("✅ Build complete! Output in /dist");

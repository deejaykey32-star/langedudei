// Buduje wersję mobilną (Android): kopiuje public/ do mobile-www/ i pakuje natywną warstwę esbuildem.
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "mobile-www");

await fs.rm(out, { recursive: true, force: true });
// Bez katalogu download – APK nie może zawierać samego siebie.
await fs.cp(path.join(root, "public"), out, { recursive: true, filter: (src) => !src.includes(`${path.sep}public${path.sep}download`) });

// Telefon: obszar pod paskiem stanu i zgoda na widok od krawędzi do krawędzi.
const indexFile = path.join(out, "index.html");
let html = await fs.readFile(indexFile, "utf8");
if (!html.includes("viewport-fit=cover")) {
  html = html.replace(/content=["']width=device-width[^"']*["']/, 'content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"');
}
html = html.replace("<body>", '<body class="native-app">');
await fs.writeFile(indexFile, html);

await build({
  entryPoints: [path.join(root, "mobile", "native-entry.js")],
  outfile: path.join(out, "js", "native", "bundle.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020", "chrome90"],
  minify: true,
  legalComments: "none",
  logLevel: "info",
});

console.log("✔ mobile-www gotowe");

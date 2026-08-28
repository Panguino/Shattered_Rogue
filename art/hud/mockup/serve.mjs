// Serves a static directory on localhost.
//
// Opening index.html straight off disk mostly works, but file:// is not a
// secure context, so the clipboard the export buttons rely on is blocked.
// Serving over http fixes that. Root defaults to art/hud so the plate paths
// resolve, and --root points it anywhere else.
//
//   node serve.mjs                              http://localhost:5173/mockup/
//   node serve.mjs --root dist --port 4173      any other static build
//
// The wiki serves through this rather than fetching a static server off the npm
// registry, so reading local docs does not depend on having a network.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : undefined;
};

const rootOption = option("root");
const root = rootOption
  ? resolve(process.cwd(), rootOption)
  : fileURLToPath(new URL("..", import.meta.url));
// A bare number stays supported because that is how the port used to be passed.
const port = Number(option("port") ?? args.find((arg) => /^\d+$/.test(arg))) || 5173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon"
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (path.endsWith("/")) path += "index.html";

  // normalize collapses any ".." before it can climb out of the art/hud root.
  const file = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ""));

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end(`not found: ${path}`);
  }
}).listen(port, () => {
  const path = rootOption ? "" : "mockup/";
  console.log(`serving ${root}`);
  console.log(`  http://localhost:${port}/${path}`);
});

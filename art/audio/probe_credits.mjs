import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
for (const line of readFileSync(join(ROOT, ".env"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#") || !t.includes("=")) continue;
  const i = t.indexOf("=");
  const k = t.slice(0, i).trim();
  const v = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!process.env[k]) process.env[k] = v;
}

const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
  headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
});
const data = await res.json();
if (!res.ok) {
  console.log("status", res.status, JSON.stringify(data).slice(0, 400));
  process.exit(1);
}

const used = data.character_count;
const limit = data.character_limit;
const reset = data.next_character_count_reset_unix
  ? new Date(data.next_character_count_reset_unix * 1000).toISOString()
  : "unknown";

console.log(`tier=${data.tier}`);
console.log(`status=${data.status}`);
console.log(`credits_used=${used}`);
console.log(`credits_limit=${limit}`);
console.log(`credits_remaining=${limit - used}`);
console.log(`reset=${reset}`);
console.log(`billing_period=${data.billing_period}`);
console.log(`currency=${data.currency}`);
console.log(`can_extend=${data.can_extend_character_limit}`);

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(here, "weapons.json"), "utf8"));
const r = data.rules;

const body = data.weapons
  .map((w) => {
    const live = w.live ? ` · ${w.live}` : "";
    const family = w.family.charAt(0).toUpperCase() + w.family.slice(1);
    return `## ${w.name}

**${family}** · starter${live}

*Silhouette:* ${w.read}

\`\`\`
${w.prompt}
\`\`\`
`;
  })
  .join("\n---\n\n");

const md = `# Weapon Art Prompts

> **Parent:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md) · **Style family:** Ace materials · **Catalog:** [art/weapons.json](weapons.json)

Starter trio. Each weapon is a **standalone hardpoint module** that bolts onto one gold ship pad. Same camera, materials, and gold rules as the player ships.

## How to use

1. Paste the full prompt into image gen (Ace \`art/ace.png\` + \`art/ships/interceptor/ace.png\` as style refs).
2. Check the **one-line silhouette**. If two weapons could swap names, discard.
3. Count **gold** — exactly one circular mounting collar. Extra gold = discard.
4. Count **mod wells** — exactly four empty crystal sockets, not gold, nothing inserted.
5. Tripo later: Smart Mesh **6,000 tris**, export **GLB 2K**. Mount socket on the gold collar, facing down.

Gold on a weapon is **only** the mount collar that matches a ship hardpoint. Modifier wells are cream/charcoal crystal bays.

## Shared rules (gameplay, not the picture)

| Rule | Value |
| --- | --- |
| Ship slot | ${r.shipSlot} |
| Levels | ${r.levels} |
| Own cap | ${r.maxOwnedPerType} of the same type |
| Mod slots | L1=${r.modSlotsByLevel[0]}, L2=${r.modSlotsByLevel[1]}, L3=${r.modSlotsByLevel[2]}, L4=${r.modSlotsByLevel[3]}, L5=${r.modSlotsByLevel[4]} |
| Death | Keep what you entered the run with. Lose unstashed finds. |
| Stash | End of each level: stash forever, or keep using it on this run. |

---

${body}`;

fs.writeFileSync(path.join(here, "weapon_prompts.md"), md);
console.log("wrote weapon_prompts.md");

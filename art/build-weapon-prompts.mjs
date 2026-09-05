import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(here, "weapons.json"), "utf8"));
const r = data.rules;
const m = data.mount;

const guns = data.weapons
  .map((w) => {
    const live = w.live ? ` · ${w.live}` : "";
    const family = w.family.charAt(0).toUpperCase() + w.family.slice(1);
    return `## ${w.name}

**${family}** · gun cartridge · starter${live}

*Silhouette:* ${w.read}

\`\`\`
${w.prompt}
\`\`\`
`;
  })
  .join("\n---\n\n");

const sockets = m.sockets.map(([k, d]) => `| **${k}** | ${d} |`).join("\n");

const md = `# Weapon Art Prompts

> **Parent:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md) · **Style family:** Ace materials · **Catalog:** [art/weapons.json](weapons.json) · **Status:** Concept, regenerating for the gimbal mount

Player weapons are **two parts**. One shared **Gimbal Base** bolts onto a gold ship pad and owns both aim axes. A **Gun Cartridge** seats in the base. Any cartridge fits any base.

## Why the split

${m.why}

| Axis | Range |
| --- | --- |
| Yaw | ${m.yaw} |
| Pitch | ${m.pitch} |

${m.interface}

## Mount spec

**Base, bottom to top.** Gold collar with a dark hex plug on the underside (snaps to the ship pad). Charcoal yaw turntable with cream index ticks, spins a full circle. Crimson drum. Crimson U-yoke with cream cheek plates. A cream trunnion cap with a hex socket on the inside of each arm; the two caps share one horizontal axis about one collar-diameter above the pad. Empty cradle between the arms, open front and top. No barrel, no wells.

**Cartridge, every gun.** Charcoal trunnion block at the rear-bottom. One cream hex axle stub out of each side, on one shared axis. Flat charcoal underside, no collar, no ring, no plug. Most of the mass sits in front of the axle and the rear is short and rounded so +90° and −90° never clip the base. Four empty hex mod wells on the body. Zero gold.

**Motion.** Yaw is the turntable, 360° continuous. Pitch is the trunnion axis, −90° (straight down) to +90° (straight up). 0° is forward along the ship.

## Sockets (for Tripo / UE)

| Socket | Where |
| --- | --- |
${sockets}

## How to use

1. Generate the **Gimbal Base** first. Then the three cartridges. Then the **assembled check** to confirm they read as one turret.
2. Paste the full prompt into ChatGPT Images with the style master \`art/ace.png\` attached (the same picture every ship uses), or run \`node art/codex-weapon-image.mjs gimbal-base\` (Codex CLI image generation, Ace attached as reference).
3. Check the **one-line silhouette**. If two guns could swap names, discard.
4. Count **gold**. Base: exactly one collar. Cartridges: **zero**. Any gold on a gun = discard.
5. Count **mod wells** on cartridges: exactly four empty crystal sockets, not gold, nothing inserted. Base has none.
6. Check the **axle stubs** on every cartridge: two cream hex stubs, one each side, at the rear. Nothing under the gun.
7. Tripo: Smart Mesh **1,500 tris** for the base (target ~1,000 final) and **2,500 tris** for each cartridge (target 1,500 to 2,000 final), export **GLB 2K**. Ace is 5,686, enemy kit parts average ~700. Wells and axle stubs stay as geometry; panel lines and vents can be normal map. Base origin on the collar underside. Gun origin on the axle center.

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

## ${m.name}

**Mount** · shared base · one per hardpoint

*Silhouette:* ${m.read}

\`\`\`
${m.prompt}
\`\`\`

---

${guns}

---

## Assembled check (base + Laser Cannon)

Not a catalog asset. Generate once to confirm the two parts read as one articulated turret.

\`\`\`
${data.assembledPrompt}
\`\`\`
`;

fs.writeFileSync(path.join(here, "weapon_prompts.md"), md);
console.log("wrote weapon_prompts.md");

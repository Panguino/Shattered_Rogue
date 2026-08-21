import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STYLE = `3D game-ready concept of a SINGLE unique spaceship, isolated on a clean light-gray studio background.

CAMERA: high 3/4 isometric from above-front-right. Show the nose, starboard side, top deck, and rear engines in one shot. Entire ship fully in frame, centered, no cropping. Slight downward angle like a top-down arcade game. Orthographic isometric product shot.

STYLE: Same locked ART FAMILY as the crimson interceptor Ace (StarCraft Terran + Ratchet & Clank / Fortnite / Astroneer toyetic, bright colors, slightly low-poly, thick panel lines). SAME materials language: cream plates, charcoal mechanics, gold hardpoint rings, stylized canopy. NOT the same silhouette as Ace unless this ship IS Ace.

CRITICAL UNIQUENESS: This named ship must be instantly recognizable from silhouette alone. Do NOT recolor a generic fighter. Do NOT copy Ace's swept delta wings + twin engines + center afterburner + four gun pads unless the identity section says this is Ace. Wings, nose, engines, and hardpoints must match THIS ship only.

GOLD HARDPOINTS ARE COUNTED. The ship lists an exact number N. There are EXACTLY N gold circular rings on the entire model — no more. Gold is only those rings. RCS thrusters, hover pads, landing feet, vents, screws, lights, and extra hatches are charcoal or cream, NEVER gold. Module and specialty slots are INTERNAL — never gold pads. Profession tools (drills, dishes, scanners, hoppers) are hull silhouette in charcoal or cream, not gold rings.

EMPTY: completely unarmed. No guns, barrels, cannons, turrets, missiles, drill bits, dishes, or cargo crates installed. Each listed hardpoint is a raised gold circular pad ON the hull with a dark hexagonal recess. NOT holes punched through wings.

Lighting: bright studio key, soft fill, punchy rim light. Low-poly stylized 3D product render.

DO NOT INCLUDE: extra gold circles beyond N, gold wingtips, gold RCS, a fleet, a second ship, recolored Ace (unless this IS Ace), holes through wings, installed weapons, flame exhaust, photorealism, grimdark, stars, nebula, planet, hangar, text, logo, watermark, cropped ship.`;

function goldSection(items) {
  const n = items.length;
  const list = items.map((t, i) => `${i + 1}. ${t}`).join("\n");
  return `GOLD RINGS: EXACTLY ${n} on the whole ship. Count them. More than ${n} means the image is wrong.

${list}`;
}

const hulls = {
  Interceptor: { color: "#e23b3b", fantasy: "Nimble dogfighter", mechanic: "Afterburner" },
  Corvette: { color: "#f0c14b", fantasy: "Balanced all-rounder", mechanic: "Adaptive Hull" },
  Carrier: { color: "#3ecf6a", fantasy: "Drone commander", mechanic: "Drone Flock" },
  Organic: { color: "#b44cff", fantasy: "Living ship (Zerg vibes)", mechanic: "Regeneration" },
  Phantom: { color: "#8b90a8", fantasy: "Stealth predator", mechanic: "Cloak" },
  Juggernaut: { color: "#4aa3ff", fantasy: "Heavy fortress", mechanic: "Fortress Mode" },
};

const ships = [
  {
    name: "Ace", hull: "Interceptor", profession: "Fighter", starting: true,
    slots: { weapons: 4, modules: 5, specialty: 1 },
    read: "tiny crimson dart with fat afterburner",
    livery: "COLOR: crimson-red primary, cream/white plates, charcoal recesses, gold rings, cyan canopy, hot orange glow in empty bells.",
    shape: `HULL SHAPE: compact nimble dogfighter. Longer pointed nose, swept-back delta wings, oversized twin rear engines PLUS a fat center afterburner. Exaggerated fighter canopy. This is the locked hero Ace silhouette — the only ship that should look like this.`,
    gold: [
      "WEAPON — left wing TOP pad",
      "WEAPON — right wing TOP pad",
      "WEAPON — left nose pad",
      "WEAPON — right nose pad",

      "ENGINE — left bell collar",
      "ENGINE — right bell collar",
      "ENGINE — center afterburner collar",
    ],
  },
  {
    name: "Prospector", hull: "Interceptor", profession: "Miner",
    slots: { weapons: 2, modules: 4, specialty: 4 },
    read: "chunky crimson mining mule, a bit longer than wide, big engines, not a square brick",
    livery: "COLOR: crimson hull, ochre-yellow hazard stripes on short wings, cream scoop-cheeks, charcoal mechanics, gold rings, cyan work-visor, dull orange torque-engine glow.",
    shape: `HULL SHAPE: chunky industrial mining mule — keep the fat toy look, but NOT a square brick. Length is about 1.3× the width: a short extra section of red fuselage between the cockpit and the engines so the visor is not glued to the bells. Blunt work-visor (small cyan glass) at the front, not a fighter nose. Cream scoop-cheeks bulge on the sides but do not make the ship wider than it is long. Short rectangular wings with hazard stripes, slightly too small for the body. Twin large wide torque engines, about one-third of the ship length (big, not half the ship). NO center afterburner. CHARCOAL wingtip blocks with a tiny cyan light (not gold). Still heavy and industrial. Wrong if it is a cube. Wrong if it is a sleek Ace dart.`,
    gold: [
      "WEAPON — left chin mining-laser pad",
      "WEAPON — right chin mining-laser pad",



      "ENGINE — left exhaust-bell collar at the REAR only",
      "ENGINE — right exhaust-bell collar at the REAR only",
    ],
  },
  {
    name: "Pathfinder", hull: "Interceptor", profession: "Scout",
    slots: { weapons: 3, modules: 3, specialty: 4 },
    read: "long-nosed crimson scout with a sensor boom and wingtip thrusters",
    livery: "COLOR: crimson, white high-vis bands, cream, gold, extra-bright cyan canopy, orange afterburner + cool cyan RCS glow.",
    shape: `HULL SHAPE: stretched interceptor — much LONGER nose than Ace, like a cartoon SR-71 toy. Thin high-aspect wings. A forward sensor boom (empty, no dish). Twin rear engines PLUS a slim center afterburner (smaller than Ace's). Tiny CHARCOAL RCS on wingtips (not gold). Canopy set far back. Silhouette is a needle, not Ace's dart.`,
    gold: [
      "WEAPON — left wing pad",
      "WEAPON — right wing pad",
      "WEAPON — single chin pad",


      "ENGINE — left bell collar",
      "ENGINE — right bell collar",
      "ENGINE — slim center afterburner collar",
    ],
  },
  {
    name: "Smuggler", hull: "Interceptor", profession: "Hauler",
    slots: { weapons: 2, modules: 6, specialty: 2 },
    read: "fat-bellied crimson runner with triple small engines and cargo blisters",
    livery: "COLOR: dark crimson + charcoal smuggler panels, cream interior-hatch rims, muted gold rings, dim cyan canopy, mixed orange/blue engine glow.",
    shape: `HULL SHAPE: interceptor scaled into a chubby blockade runner — NOT Ace, NOT a juggernaut. Deep cargo-belly blisters on both sides (empty, hatches closed). Shorter clipped wings. THREE small mismatched engine bells in a triangle (two upper, one offset lower) — looks stolen/jury-rigged. No afterburner tunnel. Low canopy. Silhouette is a pregnant dart.`,
    gold: [
      "WEAPON — left wing-root pad",
      "WEAPON — right wing-root pad",


      "ENGINE — upper-left small bell",
      "ENGINE — upper-right small bell",
      "ENGINE — offset lower small bell",
    ],
  },
  {
    name: "Probe", hull: "Interceptor", profession: "Scientist",
    slots: { weapons: 2, modules: 4, specialty: 4 },
    read: "crimson science dart with a glass lab spine and ion engine",
    livery: "COLOR: crimson + cyan-teal lab stripes, cream, gold, very bright cyan glass spine, pale-blue ion glow (not orange afterburner).",
    shape: `HULL SHAPE: small research interceptor. Narrow fuselage with a raised translucent lab-glass spine. Short canards and a rear T-tail. ONE large circular ion engine. Four small CHARCOAL RCS cubes (not gold). Scanner-arm housing on starboard. Must not look like Ace.`,
    gold: [
      "WEAPON — left canard pad",
      "WEAPON — right canard pad",



      "ENGINE — single ion bell collar",
    ],
  },

  {
    name: "Mercenary", hull: "Corvette", profession: "Fighter", starting: true,
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "medium yellow war-corvette with twin guns and twin engines",
    livery: "COLOR: sunflower-yellow primary, cream, charcoal, gold, cyan canopy, orange twin-engine glow.",
    shape: `HULL SHAPE: medium multi-role corvette — longer and boxier than Ace, not a brick. Moderate swept wings, twin military engines, no afterburner. Nanite-repair panel seams. Mid-forward canopy. This is the yellow fighter-corvette, not an interceptor.`,
    gold: [
      "WEAPON — left wing TOP pad",
      "WEAPON — right wing TOP pad",



      "ENGINE — left bell collar",
      "ENGINE — right bell collar",
    ],
  },
  {
    name: "Driller", hull: "Corvette", profession: "Miner",
    slots: { weapons: 1, modules: 4, specialty: 5 },
    read: "yellow industrial corvette with a giant empty nose-drill housing",
    livery: "COLOR: yellow-gold, black hazard stripes, cream hoppers, charcoal, gold, cyan visor, orange heavy-engine glow.",
    shape: `HULL SHAPE: corvette rebuilt as a mining rig. HUGE cylindrical empty drill-housing on the nose (no bit). Stubby wings. Side ore-hoppers. Twin HEAVY engines. A small CHARCOAL ventral lift thruster (not gold). Boxy work canopy. Completely different nose from Mercenary.`,
    gold: [
      "WEAPON — small dorsal turret pad",




      "ENGINE — left heavy collar",
      "ENGINE — right heavy collar",
    ],
  },
  {
    name: "Ranger", hull: "Corvette", profession: "Scout",
    slots: { weapons: 2, modules: 4, specialty: 4 },
    read: "yellow patrol corvette with a tall sensor mast",
    livery: "COLOR: yellow, forest-teal scout bands, cream, gold, cyan, orange engines + teal sensor glow.",
    shape: `HULL SHAPE: lean patrol corvette. Longer wings than Mercenary. A TALL empty sensor-mast tower (no dish). Twin engines. CHARCOAL wingtip RCS (not gold). Open observation canopy.`,
    gold: [
      "WEAPON — left mid-wing pylon pad",
      "WEAPON — right mid-wing pylon pad",



      "ENGINE — left bell collar",
      "ENGINE — right bell collar",
    ],
  },
  {
    name: "Trader", hull: "Corvette", profession: "Hauler",
    slots: { weapons: 1, modules: 6, specialty: 3 },
    read: "yellow merchant with a cargo box midships and fat engines",
    livery: "COLOR: yellow, warm brown-gold cargo bands, cream, gold, cyan, orange fat-engine glow.",
    shape: `HULL SHAPE: corvette with a rectangular CARGO MODULE replacing the mid fuselage — like a toy truck in space. Short wings. FAT twin engines. One small defensive turret ring on top. No drill, no mast. Silhouette is a flying crate with a cockpit.`,
    gold: [
      "WEAPON — dorsal defensive turret pad",



      "ENGINE — left fat bell collar",
      "ENGINE — right fat bell collar",
    ],
  },
  {
    name: "Researcher", hull: "Corvette", profession: "Scientist",
    slots: { weapons: 1, modules: 5, specialty: 4 },
    read: "yellow lab-corvette with a glass observatory blister",
    livery: "COLOR: yellow, cyan-lilac science bands, cream, gold, bright cyan observatory glass, pale ion glow.",
    shape: `HULL SHAPE: science corvette. Smooth hull, a large spherical empty observatory blister on top (no telescope). Short wings. Twin ion engines. CHARCOAL hover pads under the belly (not gold). Must not look like Mercenary or Trader.`,
    gold: [
      "WEAPON — under-nose sample-laser pad",




      "ENGINE — left ion collar",
      "ENGINE — right ion collar",
    ],
  },

  {
    name: "Warlord", hull: "Carrier", profession: "Fighter",
    slots: { weapons: 1, modules: 6, specialty: 3 },
    read: "green attack carrier with four drone bays and a nose gun",
    livery: "COLOR: forest-green, cream armored deck, charcoal bays, gold, cyan offset canopy, orange twin glow.",
    shape: `HULL SHAPE: wide attack carrier. Flat armored flight deck with FOUR round empty drone-bay pads in a 2×2 grid. Twin military nacelles. Canopy offset to port. Angular combat prow. Looks like a toy mothership for fighters, not a cargo barge.`,
    gold: [
      "WEAPON — nose prow pad",
      "DRONE — deck bay 1",
      "DRONE — deck bay 2",
      "DRONE — deck bay 3",
      "DRONE — deck bay 4",

      "ENGINE — left nacelle collar",
      "ENGINE — right nacelle collar",
    ],
  },
  {
    name: "Foreman", hull: "Carrier", profession: "Miner",
    slots: { weapons: 1, modules: 5, specialty: 4 },
    read: "green mining mothership with sieve-deck and wide torque engines",
    livery: "COLOR: green, ochre mining stripes, cream, charcoal, gold, cyan, orange wide-engine glow.",
    shape: `HULL SHAPE: industrial carrier. Open sieve-grill deck (still solid mesh, not holes through to background). THREE large mining-drone bays in a row. Side ore-chutes. Twin extra-WIDE torque engines. Blunt work prow. Different deck layout from Warlord.`,
    gold: [
      "WEAPON — side utility / mining-charge pad",
      "DRONE — mining bay 1",
      "DRONE — mining bay 2",
      "DRONE — mining bay 3",


      "ENGINE — left wide torque collar",
      "ENGINE — right wide torque collar",
    ],
  },
  {
    name: "Spymaster", hull: "Carrier", profession: "Scout",
    slots: { weapons: 1, modules: 5, specialty: 4 },
    read: "slim green stealth carrier with a sail-fin and recon bays",
    livery: "COLOR: dark green + teal, cream, gold, dim cyan canopy, cool-blue quiet engines.",
    shape: `HULL SHAPE: SLIMMER carrier than Warlord — almost a flying wing. One tall empty sail-fin/sensor keel on top. TWO elongated recon-drone bays (ovals, not circles) on the deck. Recessed quiet engines. Stealth prow. Must look sneaky, not industrial.`,
    gold: [
      "WEAPON — under-chin pad",
      "DRONE — oval recon bay 1",
      "DRONE — oval recon bay 2",


      "ENGINE — left recessed collar",
      "ENGINE — right recessed collar",
    ],
  },
  {
    name: "Magnate", hull: "Carrier", profession: "Hauler",
    slots: { weapons: 1, modules: 7, specialty: 2 },
    read: "green merchant carrier with container rails and four engines",
    livery: "COLOR: green, rich gold cargo banding, cream containers-unloaded rails, gold rings, cyan, orange quad-engine glow.",
    shape: `HULL SHAPE: merchant mothership. Container-rail spine down the center (empty rails, no boxes). TWO cargo-drone bays. FOUR small engines in a square. Wider and flatter than Warlord. Civilian-looking prow.`,
    gold: [
      "WEAPON — tail defensive pad",
      "DRONE — cargo-drone bay 1",
      "DRONE — cargo-drone bay 2",

      "ENGINE — square bell 1",
      "ENGINE — square bell 2",
      "ENGINE — square bell 3",
      "ENGINE — square bell 4",
    ],
  },
  {
    name: "Professor", hull: "Carrier", profession: "Scientist",
    slots: { weapons: 1, modules: 5, specialty: 4 },
    read: "green campus-carrier with a glass lecture dome and analysis drones",
    livery: "COLOR: green, cyan-violet lab markings, cream, gold, bright cyan lecture dome, pale ion glow.",
    shape: `HULL SHAPE: academic carrier. A glass lecture-dome amidships (cream/charcoal crown, no gold ring on the dome). THREE small analysis-drone bays around the dome. Twin ion nacelles. Soft rounded prow. Must not look military or like a cargo barge.`,
    gold: [
      "WEAPON — nose research-beam pad",
      "DRONE — analysis bay 1",
      "DRONE — analysis bay 2",
      "DRONE — analysis bay 3",


      "ENGINE — left ion collar",
      "ENGINE — right ion collar",
    ],
  },

  {
    name: "Predator", hull: "Organic", profession: "Fighter",
    slots: { weapons: 2, modules: 7, specialty: 1 },
    read: "horned purple hunter with twin bio-jets",
    livery: "COLOR: royal-purple carapace, magenta veins, cream bone plates, gold rings, cyan-green eye, magenta-orange vent glow.",
    shape: `HULL SHAPE: living fighter. Aggressive horned carapace, two swept bio-wings like a cartoon beetle. Twin rear bio-jets. Canopy is a single predatory eye-dome. Compact and mean. NOT a blob, NOT a hive.`,
    gold: [
      "WEAPON — left bio-wing pad",
      "WEAPON — right bio-wing pad",

      "ENGINE — left bio-jet collar",
      "ENGINE — right bio-jet collar",
    ],
  },
  {
    name: "Hive", hull: "Organic", profession: "Miner",
    slots: { weapons: 1, modules: 6, specialty: 3 },
    read: "round purple honeycomb miner with cluster vents",
    livery: "COLOR: purple, amber honeycomb plates, cream, gold, cyan-green eye, warm vent glow.",
    shape: `HULL SHAPE: rounder living hive-ship. Hex-plate carapace, swollen miner-sacs on the sides (closed). Cluster of small CHARCOAL rear vents with only TWO gold collars on the two largest vents. Short stubby fins. Cute-bio industrial, like a toy bee.`,
    gold: [
      "WEAPON — chin sting pad",



      "ENGINE — left main vent collar",
      "ENGINE — right main vent collar",
    ],
  },
  {
    name: "Symbiote", hull: "Organic", profession: "Scout",
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "frilled purple scout-organism with many tiny thrusters",
    livery: "COLOR: purple, teal sensory veins, cream, gold, bright eye, mixed teal/magenta glow.",
    shape: `HULL SHAPE: slender living scout. Frilled sensory fins (short, not spaghetti). Elongated manta shape. Tiny CHARCOAL thruster-pores along the tail plus TWO gold engine collars on the two largest tail jets.`,
    gold: [
      "WEAPON — left frill-wing pad",
      "WEAPON — right frill-wing pad",



      "ENGINE — left tail-jet collar",
      "ENGINE — right tail-jet collar",
    ],
  },
  {
    name: "Leviathan", hull: "Organic", profession: "Hauler",
    slots: { weapons: 1, modules: 7, specialty: 2 },
    read: "swollen purple cargo-beast with a siphon tail",
    livery: "COLOR: purple, heavy cream belly plates, gold, dim eye, deep orange siphon glow.",
    shape: `HULL SHAPE: the BIGGEST organic — swollen cargo-belly, short fins, massive single siphon-tail engine. Still one toy ship, not a whale that fills the frame. Rounded, heavy, slow-looking. Completely different mass from Predator.`,
    gold: [
      "WEAPON — head defense pad",


      "ENGINE — huge siphon-tail collar",
    ],
  },
  {
    name: "Specimen", hull: "Organic", profession: "Scientist",
    slots: { weapons: 2, modules: 6, specialty: 2 },
    read: "translucent purple lab-organism with glowing organs",
    livery: "COLOR: translucent purple, cyan organ-lights, cream bone frame, gold, very bright eye, pale lab glow.",
    shape: `HULL SHAPE: lab-grown living ship. Semi-translucent carapace with stylized glowing organ-shapes inside (cartoon, not gore). Symmetric, elegant, almost moth-like. Twin glass-jet vents. Must look scientific, not predatory or fat.`,
    gold: [
      "WEAPON — left moth-wing pad",
      "WEAPON — right moth-wing pad",


      "ENGINE — left glass-jet collar",
      "ENGINE — right glass-jet collar",
    ],
  },

  {
    name: "Assassin", hull: "Phantom", profession: "Fighter",
    slots: { weapons: 3, modules: 5, specialty: 2 },
    read: "black needle stealth fighter with recessed twin engines",
    livery: "COLOR: matte charcoal-black, violet edge light, cream inner panels, gold, dim cyan canopy, cool-blue recessed glow.",
    shape: `HULL SHAPE: slim stealth fighter. Faceted blade-wings, needle nose, LOW canopy. Twin RECESSED engines (not fat Ace bells). No afterburner. Compact and lethal. This is the Phantom fighter, not a pirate barge.`,
    gold: [
      "WEAPON — left blade-wing pad",
      "WEAPON — right blade-wing pad",
      "WEAPON — nose pad",


      "ENGINE — left recessed collar",
      "ENGINE — right recessed collar",
    ],
  },
  {
    name: "Ghost Miner", hull: "Phantom", profession: "Miner",
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "black silent miner with a chin drill-housing and wide quiet engines",
    livery: "COLOR: charcoal, ochre stealth-miner marks, cream, gold, dim cyan, cool-blue wide-engine glow.",
    shape: `HULL SHAPE: stealth mining Phantom. Wider than Assassin. Blunt chin with an empty silent-drill housing (charcoal mouth, no bit, no gold ring). Folded quiet wings. Twin WIDE muffled engines with shrouds. Looks like a sneaky tug, not a needle.`,
    gold: [
      "WEAPON — left wing-fold pad",
      "WEAPON — right wing-fold pad",



      "ENGINE — left shrouded collar",
      "ENGINE — right shrouded collar",
    ],
  },
  {
    name: "Shadow", hull: "Phantom", profession: "Scout",
    slots: { weapons: 2, modules: 4, specialty: 4 },
    read: "black flying-wing scout with a sensor blade",
    livery: "COLOR: charcoal, teal recon edges, cream, gold, dim cyan, cool-blue + teal glow.",
    shape: `HULL SHAPE: flying-wing Phantom. Almost no fuselage. A thin vertical sensor-blade fin. Engines buried in the wing trailing edge (two slots). Looks like a cartoon bat-wing, not Assassin's needle.`,
    gold: [
      "WEAPON — left wing-root pad",
      "WEAPON — right wing-root pad",



      "ENGINE — left trailing-edge collar",
      "ENGINE — right trailing-edge collar",
    ],
  },
  {
    name: "Pirate", hull: "Phantom", profession: "Hauler",
    slots: { weapons: 3, modules: 5, specialty: 2 },
    read: "asymmetric black corsair with mismatched engines and a cargo hook",
    livery: "COLOR: charcoal, worn crimson pirate flashes, cream, gold, dim cyan, mixed orange/blue mismatched engine glow.",
    shape: `HULL SHAPE: ASYMMETRIC stealth hauler. One wing longer than the other. A cargo-hook crane housing on the starboard side (charcoal, empty, no gold ring). TWO mismatched engines — one fat stolen orange-glow bell, one slim blue stealth bell. Irregular armor patches. Cartoon corsair, not a galleon, not Assassin.`,
    gold: [
      "WEAPON — longer-wing pad",
      "WEAPON — nose pad",
      "WEAPON — crane-arm pintle pad",


      "ENGINE — fat stolen-bell collar",
      "ENGINE — slim stealth-bell collar",
    ],
  },
  {
    name: "Infiltrator", hull: "Phantom", profession: "Scientist",
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "black spy-lab Phantom with a glass spike and ion drive",
    livery: "COLOR: charcoal, cyan-violet science edges, cream, gold, brighter canopy, pale ion glow.",
    shape: `HULL SHAPE: spy-lab Phantom. Slim body with a glass sensor-spike instead of a gun nose. Single buried ion drive. Small canard wings. Looks like a stealth probe, not a fighter or pirate.`,
    gold: [
      "WEAPON — left canard pad",
      "WEAPON — right canard pad",



      "ENGINE — single buried ion collar",
    ],
  },

  {
    name: "Warmonger", hull: "Juggernaut", profession: "Fighter",
    slots: { weapons: 3, modules: 6, specialty: 1 },
    read: "blue fortress gunship with shoulder pads and triple heavy engines",
    livery: "COLOR: steel-blue, cream ram plates, charcoal, gold, cyan canopy, orange heavy glow.",
    shape: `HULL SHAPE: heavy fortress gunship. Thick armor blocks, short wide wings, slab ram-nose, dorsal shield ridge. Twin plus CENTER heavy engines. Huge compared to Ace. Toy brick tank of the sky.`,
    gold: [
      "WEAPON — left shoulder pad",
      "WEAPON — right shoulder pad",
      "WEAPON — nose ram pad",

      "ENGINE — left heavy collar",
      "ENGINE — right heavy collar",
      "ENGINE — center heavy collar",
    ],
  },
  {
    name: "Excavator", hull: "Juggernaut", profession: "Miner",
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "blue mining citadel with a mega empty drill and dual super-torque engines",
    livery: "COLOR: steel-blue, ochre mining chevrons, cream bunkers, charcoal, gold, cyan, orange super-torque glow.",
    shape: `HULL SHAPE: mining citadel. A MEGA empty drill-housing replacing the ram-nose (no bit). Side ore-bunkers. TWO super-fat engines only (no center). CHARCOAL ventral jack-pads (not gold). Looks like a flying quarry, not Warmonger.`,
    gold: [
      "WEAPON — left bunker-turret pad",
      "WEAPON — right bunker-turret pad",



      "ENGINE — left super-torque collar",
      "ENGINE — right super-torque collar",
    ],
  },
  {
    name: "Outpost", hull: "Juggernaut", profession: "Scout",
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "blue mobile firebase with a radar tower",
    livery: "COLOR: steel-blue, white-teal survey marks, cream, gold, cyan, orange + teal radar glow.",
    shape: `HULL SHAPE: mobile firebase. A tall empty RADAR TOWER (no dish). Flatter hull than Warmonger. Twin engines. CHARCOAL landing-foot thrusters (not gold). Toy watchtower that flies.`,
    gold: [
      "WEAPON — left wall-turret pad",
      "WEAPON — right wall-turret pad",



      "ENGINE — left bell collar",
      "ENGINE — right bell collar",
    ],
  },
  {
    name: "Freighter", hull: "Juggernaut", profession: "Hauler",
    slots: { weapons: 2, modules: 7, specialty: 1 },
    read: "blue armored cargo-brick with four engines and container rails",
    livery: "COLOR: steel-blue, cargo-orange bands, cream, gold, cyan, orange quad-engine glow.",
    shape: `HULL SHAPE: armored cargo brick. Long rectangular container-rails (empty). FOUR engines in a 2×2 block at the stern. Tiny cockpit tower. Two small defensive sponsons. This is a flying warehouse, not a gun fortress. Fortress Mode is gameplay (stop-to-shield), not a gold pad.`,
    gold: [
      "WEAPON — left sponson pad",
      "WEAPON — right sponson pad",

      "ENGINE — stern bell 1",
      "ENGINE — stern bell 2",
      "ENGINE — stern bell 3",
      "ENGINE — stern bell 4",
    ],
  },
  {
    name: "Observatory", hull: "Juggernaut", profession: "Scientist",
    slots: { weapons: 2, modules: 5, specialty: 3 },
    read: "blue cathedral-lab with a huge empty dome and station-keeping thrusters",
    livery: "COLOR: steel-blue, cyan-lilac observatory bands, cream, gold, huge bright cyan dome, pale ion + orange glow.",
    shape: `HULL SHAPE: flying cathedral of science. A HUGE empty observatory dome (no telescope). Twin ion engines. Four tiny CHARCOAL station-keeping thrusters on the corners (not gold). Must not look like Warmonger or Freighter.`,
    gold: [
      "WEAPON — left flank pad",
      "WEAPON — right flank pad",



      "ENGINE — left ion collar",
      "ENGINE — right ion collar",
    ],
  },
];

function promptFor(s) {
  return `${STYLE}

SHIP IDENTITY: "${s.name}" — ${s.hull} hull × ${s.profession} profession. Unique mechanic: ${hulls[s.hull].mechanic}.
ONE-LINE SILHOUETTE: ${s.read}. If it does not match this, the image is wrong.

${s.shape}

${s.livery}

${goldSection(s.gold)}

Gameplay inventory (do NOT add extra gold for these): ${s.slots.weapons} weapon slots, ${s.slots.modules} module slots INTERNAL, ${s.slots.specialty} specialty slots INTERNAL. Visible gold = weapons + engine collars${s.gold.some((g) => /^\s*DRONE\b/i.test(g)) ? " + Carrier drone bays" : ""} only (${s.gold.length}).`
}

const data = {
  generated: "2026-08-20",
  note: "Each named combo has a unique silhouette, engines, and hardpoints. Visible gold = weapons + engines (+ Carrier drone bays). Specialty is inventory-only. Hull = size class + unique mechanic. Profession = shape kit + slot mix (still 10 total).",
  styleLock: STYLE,
  hulls,
  ships: ships.map((s) => ({
    id: s.name.toLowerCase().replace(/\s+/g, "-"),
    name: s.name,
    hull: s.hull,
    profession: s.profession,
    starting: !!s.starting,
    mechanic: hulls[s.hull].mechanic,
    slots: s.slots,
    goldCount: s.gold.length,
    gold: s.gold,
    color: hulls[s.hull].color,
    read: s.read,
    prompt: promptFor(s),
  })),
};

fs.writeFileSync(path.join(__dirname, "ships.json"), JSON.stringify(data, null, 2), "utf8");

const lines = [
  "# Ship Art Prompts (ChatGPT → Tripo)",
  "",
  "> **Parent:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md) · **Style family:** Ace materials, unique silhouettes per named combo",
  "",
  "Each of the **30** ships is a different vehicle. Hull = size class + unique mechanic. Profession = silhouette kit, engines, and slot mix (**still 10 slots**). Do not generate a recolored Ace.",
  "",
  "## How to use",
  "",
  "1. Paste the full prompt into ChatGPT Images.",
  "2. Check the **one-line silhouette**. If it looks like Ace with new paint, discard it.",
  "3. Count **gold rings** — must match the number in the prompt. Extra gold = discard.",
  "4. Tripo Smart Mesh **6,000 tris**, export **GLB 2K**.",
  "",
  "Visible gold = weapon pads + engine collars (+ Carrier drone bays). Modules and specialty are inventory-only — never gold. RCS / hover / feet are never gold.",
  "",
  "## Slot mix (all total 10)",
  "",
  "| | Fighter | Miner | Scout | Hauler | Scientist |",
  "| --- | --- | --- | --- | --- | --- |",
];

const hullOrder = ["Interceptor", "Corvette", "Carrier", "Organic", "Phantom", "Juggernaut"];
const profOrder = ["Fighter", "Miner", "Scout", "Hauler", "Scientist"];
function slotStr(s) {
  return `${s.slots.weapons}W/${s.slots.modules}M/${s.slots.specialty}S`;
}
for (const hull of hullOrder) {
  const cells = profOrder.map((p) => {
    const sh = data.ships.find((x) => x.hull === hull && x.profession === p);
    return `**[${sh.name}](#${sh.id})**<br/>${slotStr(sh)} · ${sh.goldCount} gold`;
  });
  lines.push(`| **${hull}** | ${cells.join(" | ")} |`);
}

lines.push("", "---", "");

for (const sh of data.ships) {
  lines.push(`## ${sh.name}`);
  lines.push("");
  lines.push(`**${sh.hull} × ${sh.profession}** · ${sh.mechanic} · ${slotStr(sh)} · **${sh.goldCount} gold rings**`);
  lines.push("");
  lines.push(`*Silhouette:* ${sh.read}`);
  lines.push("");
  lines.push("```");
  lines.push(sh.prompt.trim());
  lines.push("```");
  lines.push("");
}

fs.writeFileSync(path.join(__dirname, "ship_prompts.md"), lines.join("\n"), "utf8");
console.log(`Wrote ${data.ships.length} unique ships`);

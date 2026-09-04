# Engine MCP / AI Integration Research

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)
>
> **Researched:** 2026-08-19
> **Decision:** Stay on **Unreal Engine 5.8** (C++ primary). Do not switch to Unity or Godot.

---

## 1. Question

Which engine has the best MCP (Model Context Protocol) AI integration in 2026, and should Shattered Slop switch off Unreal 5.5 before the project is created?

---

## 2. Snapshot (August 2026)

| Engine | First-party MCP | Community depth | AI writes gameplay | 4-player co-op | Fit for this game |
| ------ | --------------- | --------------- | ------------------ | -------------- | ----------------- |
| **Unreal 5.8** | Official Experimental plugin (June 2026). Native Cursor / Claude Code / Codex config. | StraySpark (commercial, 400+ tools), ChiR24, chongdashu | Harder — C++ + Blueprints | Best built-in replication | **Winner for us** |
| **Unity 6** | Official `com.unity.ai.assistant` MCP bridge — still **pre-release** | Largest ecosystem (~20k combined stars). CoplayDev 13.4k, IvanMurzak 3.9k, AnkleBreaker 288 tools | Easier — C# | Good (NGO / Fish-Net), extra setup | Best *tool count*, not best *game fit* |
| **Godot 4** | None | Strong: GoPeak 95+ tools, Coding-Solo ~5k stars, GDAI $19 | Easiest — GDScript + text `.tscn` | Weakest of the three | Fastest solo prototype, weakest netcode |

Roblox has the most *native* MCP (built into Studio, playtest automation), but it is not a candidate for this game.

---

## 3. Unreal Engine 5.8

Epic shipped **Unreal MCP** as an Experimental editor plugin in UE 5.8 (June 2026). Documented at [Unreal MCP in Unreal Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor). Unreal Fest Chicago 2026 covered MCP + native Agent Skills (`UAgentSkill`).

**What it does**

- Embeds an MCP server inside the editor: `http://127.0.0.1:8000/mcp` (HTTP + SSE, loopback only).
- Cursor, Claude Code, VS Code, Gemini, Codex — `ModelContextProtocol.GenerateClientConfig Cursor` writes `.mcp.json`.
- Tools come from the Toolset Registry (Python or C++). Default path: enable **Unreal MCP** + **All Toolsets**.
- Tool-search mode keeps the schema small: `list_toolsets` → `describe_toolset` → `call_tool`.
- Custom tools: `UToolsetDefinition` + `UFUNCTION(meta = (AICallable))`, or Python `@tool_call`.

**Limits (Experimental)**

- Incomplete; APIs can change.
- No auth. Loopback only. Not for shipping.
- Tools run serially on the game thread — no overlapping calls.
- No MCP Resources/Prompts from shipping toolsets.
- `stdio` / WebSocket not supported (HTTP/SSE only).

**Community / commercial (use if official toolsets are too thin)**

| Option | Notes |
| ------ | ----- |
| [StraySpark Unreal MCP Server](https://www.strayspark.studio/products/unreal-mcp-server) | 5.7 + 5.8 builds, 400+ tools / 60 categories, Cursor/Claude. Paid. |
| [ChiR24/Unreal_mcp](https://github.com/ChiR24/Unreal_mcp) | Active OSS, UE 5.0–5.8, HTTP/SSE. |
| chongdashu/unreal-mcp | Most-starred OSS (~2k). Older; 5.5 starter. Fallback only. |

**Setup we will use (Phase 1)**

1. Create project on **UE 5.8**, Blank C++.
2. Enable plugins: Unreal MCP, All Toolsets.
3. Editor Preferences → Model Context Protocol → Auto Start Server.
4. Console: `ModelContextProtocol.GenerateClientConfig Cursor`
5. Launch Cursor from the project root after the editor is up.

---

## 4. Unity 6

Unity’s official MCP lives in `com.unity.ai.assistant` (docs as of 2.16.0-pre). Unity acts as the server; a relay binary under `~/.unity/relay/` speaks MCP to Cursor / Claude. Custom tools via `[McpTool]`.

Community still leads for production:

- **CoplayDev/unity-mcp** — adoption leader, 13,400+ stars
- **IvanMurzak/Unity-MCP** — deepest integration, runtime agents, 3,900+ stars
- **AnkleBreaker** — 288 tools, Shader Graph / NavMesh / builds / profiling

**Why we are not switching:** official MCP is still pre-release; C# would be nicer for AI, but 4-player listen-server replication, Niagara, and MetaSound are already designed in Unreal. Rewriting ~1,500 milestone steps for more MCP *tools* is the wrong trade.

---

## 5. Godot 4

No first-party MCP. Best community options:

- **GoPeak** (`npx gopeak`) — 95+ tools, compact/full profiles, editor + runtime + LSP/DAP
- **Coding-Solo/godot-mcp** — most-starred (~5k)
- **GDAI MCP** — $19 commercial

GDScript + text scenes is the best “AI writes the whole game” loop. Online 4-player co-op, juicy VFX, and a long content pipeline are weaker than Unreal for this design.

---

## 6. Decision

**Stay Unreal. Bump 5.5 → 5.8.** Project is not created yet, so the version bump is free.

| Keep Unreal because | Do not switch because |
| ------------------- | --------------------- |
| Official MCP + Cursor config in 5.8 | Unity has more community tools, not a better co-op stack for us |
| Built-in replication for 1–4 players | Godot MCP is community-only; netcode is more DIY |
| Niagara + MetaSound already in design | Existing architecture/milestones are UE |
| Custom MCP tools in C++/Python as we grow | C++ is harder for AI — offset by MCP editor control + Cursor |

**Fallback:** if Epic’s Experimental plugin is too thin in practice, add ChiR24 (free) or StraySpark (paid) without changing engines.

---

## 7. Sources

- Epic: [Unreal MCP in Unreal Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor) (UE 5.8)
- Unity: [AI client integration with Unity (MCP)](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.16/manual/integration/unity-mcp-overview.html)
- Landscape review: [ChatForest game-engine MCP servers](https://chatforest.com/reviews/game-engine-3d-development-mcp-servers/) (refreshed 2026)
- StraySpark: [Unreal MCP Server](https://www.strayspark.studio/products/unreal-mcp-server)
- GoPeak: [HaD0Yun/Gopeak-godot-mcp](https://github.com/HaD0Yun/Gopeak-godot-mcp)

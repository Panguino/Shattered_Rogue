# Audio workspace

Generated candidates are separated by purpose so Unreal imports can preserve
the same categories:

```text
lib/
elevenlabs/
  music/
    beds/
  sfx/
    collisions/
    impacts/
    movement/
    shields/
    ui/
    weapons/
archive/
  YYYY-MM-DD-description/
    music/
    sfx/
```

Files in `archive/` are retained experiments, not current integration
candidates. Do not import them into the playable project unless a candidate is
explicitly promoted.

## Naming

Use `<event>_<variant>.mp3` for generated candidates, for example
`laser_cannon_rapid_v01.mp3`. Increment the variant instead of overwriting an
earlier generation so comparisons remain possible.

A rejected take stays on disk and its cue is marked `superseded` in the
generator. That keeps the prompt that produced the wrong result readable next to
the one that replaced it, which is most of why a second attempt lands. A take
that has been imported into the playable project is marked `promoted`.

Generation is not deterministic, so rebuilding either kind replaces the audio
rather than reproducing it — for a promoted cue that would quietly desync the
candidate from the asset built out of it. Both are held back from a default run
and rebuild only when named explicitly.

## Short cues and the 500 ms floor

The sound API will not generate anything shorter than half a second, and the
cannon fires every 125 ms. Cues that need to be shorter than the floor request
`pcm_44100`, get trimmed to `trimSeconds`, and are written as WAV. Trimming raw
PCM lands mid-waveform, so the last 6 ms are ramped to zero — without that the
cut itself is an audible click eight times a second.

Generated audio comes back mastered to full scale. Set headroom with a Sound
Class in Unreal rather than by regenerating; rapid-fire cues in particular will
sum well past 0 dBFS if they play at unity.

## Loops

Sustained cues set `loop: true` and must be written as WAV. MP3 pads both ends
of the file with encoder silence, which is inaudible on a one-shot and a
repeating tick on anything that loops.

Asking for a loop gets audio with no padding and no rev, but the two ends still
meet at an arbitrary phase and level. The generator therefore crossfades the
tail over the head and drops the duplicated tail, which makes the seam
continuous by construction; a loop comes out `loopCrossfade` seconds shorter
than requested as a result. The one-shot tail fade is skipped for loops, because
it would land in the middle of that seam.

Write the prompt so the source is deliberately inert - constant pitch, constant
level, no swell or pass-by. Left to itself the model tells a little story, and
any story becomes an obvious pulse on repeat. Dynamics belong in the engine,
driven off gameplay state, not baked into the sample.

To check a loop, compare the level of the first and last 50 ms and confirm the
sample step across the seam is unremarkable against the file's own typical
sample-to-sample movement. Judge both against the file rather than against a
fixed threshold: comparing the step to peak instead will flag a perfectly good
loop, since bright signals routinely jump half of full scale between adjacent
samples, and a seam is fine when it sits inside the level variation that already
exists between neighbouring windows elsewhere in the clip.

Seam quality is not a smooth function of `loopCrossfade`, because it depends on
where in the source the blended regions happen to land. Sweep the length and
measure rather than reaching for a longer blend; on the engine loop, 0.3s left a
3.6 dB step where 0.6s left 0.5 dB.

## Tone is a filter problem, not a prompt problem

The prompt steers *what the sound is*. It does not reliably steer how bright it
is. Two attempts at a deep engine that named the fault directly - "no high
whine, no hiss, no turbine scream", "dark and mellow with no top end at all" -
came back at 6.6 kHz and 20.9 kHz respectively, both brighter than the take they
were meant to replace, and the second with its low end 18.8 dB down.

So treat brightness as post-processing. `lowpassHz` rolls off the top at about
24 dB per octave and restores the original RMS afterwards, because otherwise a
filtered cue reads as quiet rather than dark, and those are different notes to
give an audio system.

Prefer fixing a good take over rolling for a new one. A cue with `from` instead
of `prompt` derives from an existing candidate, costs no credits, and is
reproducible in a way a regeneration is not - which matters when the source has
the steadiness and weight you want and only its tone is wrong.

## Music: loops, not pieces

The first round of music rated 6 to 7.5 out of 10 and failed in one consistent
way — they were musical pieces, not game loops. They opened quiet, arced to a
payoff and ended, which is the wrong shape for audio sitting under a run of
unknown length. The other complaint was shared by every take: a keyboard or kick
ostinato, close to two notes repeating, mixed louder than the melody it was
supposed to support.

Two things follow from that.

A **composition plan** replaces the single prompt. Chunks carry their own
positive and negative styles, so "no quiet intro" and "no ending" are stated on
every chunk rather than buried in one paragraph the model reads loosely, and the
beat complaint becomes an explicit per-chunk ban. Plans also accept a `seed`,
which a bare prompt does not, so a take can be nudged instead of re-rolled.

Chunk durations are **bar-aligned**. Sections are written in bars and converted
to milliseconds, so a chunk boundary always lands on a downbeat. A loop
generated off the beat grid cannot be rescued by trimming afterwards. Sections
are 8 or 16 bars, which is also what constrains the total: at 150 BPM the
reachable lengths near four minutes are 3:50 and 4:03, so a request for "four
minutes" becomes 152 bars rather than a flat 240000ms.

A longer version of an approved take is **conditioned** on it rather than rolled
again. `conditioning_ref` on the first chunk points at the earlier `song_id` and
carries through the rest, which is the difference between a version of that
track and a fresh attempt at the same brief. It requires the source to have been
generated with `store_for_inpainting`, so that flag is set on every run here —
the cost of setting it is nothing and the cost of having missed it is the take
being unusable as a reference later.

Adding a layer means **appending** direction, not rewriting it. The machine
layer is a style block concatenated onto every chunk's existing styles, so the
music underneath is untouched.

**Background noise is not an instrument**, and the difference has to be stated.
Writing the machines as percussion is what gets them in time with the music, and
that is exactly why the 4-minute take rated 4/10: in time meant part of the
composition, and the layer stopped decorating the music and started being it. So
there are two machine modes. `ambient` says the opposite of `percussion` in
every respect — off the beat, quiet, occasional, explicitly not an instrument —
and comes with its own bans, because a positive instruction not to play on the
beat is weaker than also forbidding it.

The same take lost the **electric guitar**, which nothing in the plan would have
brought back: the guitar was in the round-one prompts, and the keys-led plans
that replaced them never mentioned it. A style that is not named is not present,
so returning to an earlier character means restating it rather than assuming the
lineage carries it. Two rounds of "add X" also drifted the mix into EDM anthem
territory, so those markers are now banned globally.

**Name each layer or they merge.** Asking for layered guitars gets one thicker
guitar, because nothing in the request distinguishes the layers from each other.
Three voices described separately - synth guitar on top, overdriven electric in
the middle, clean chorused underneath, each in its own register - stay three
voices, and unison playing is banned to hold them apart. "Electric guitar" on
its own also kept returning something closer to a rock band than to a machine,
which is why the lead is named as a synth or MIDI guitar instead.

**Half time is an arrangement rule**, not an adjective. The dual timescale that
reviewed well on the prog take is now stated as which parts are allowed to move
fast: the guitars phrase in whole and half notes held across bars while the
arpeggio and the kit carry the sixteenths. Left implicit, a request for slow
guitars over a fast track tends to slow the whole track down instead.

## Ambience is not a short track

A standing ban list is only safe while the cues share a shape. The pure
creak-and-whirr bed breaks that: the beat bans describe a fault a pulseless
piece cannot have, and the ban on hiss and noise would have fought the brief
outright, since a hull under pressure is largely made of the thing it forbids.
So the bans are split into a core set, a beat set and the noise ban, and a brief
opts out with `beat: false` and `clean: false`.

Bar alignment goes with them. An ambience with no pulse has nothing to align to,
so those chunks state milliseconds directly and a 30-second request is 30
seconds rather than the nearest whole number of bars.

**Random has to be asked for, and regular has to be banned.** A repeated event
drifts toward an even spacing on its own, and an evenly spaced creak is a pulse
in a piece whose whole point is not having one. So the creak takes state the
irregularity as a rule and forbid the interval, and the sections carry different
densities - scattered, clustered, sparse - so the randomness has somewhere to
show rather than being asserted once and averaged away.

A take asked for by name is held back from a default run with `keep`, alongside
the `superseded` ones. Both would be replaced rather than reproduced by a
rebuild, which is worth avoiding for opposite reasons.

## A ban list is not a style

The bans accumulated one review at a time, which makes it easy to forget that
each one encodes an assumption about the cue it was written for. Three have now
had to be lifted for a brief that wanted the thing they forbid: the beat bans
and the noise ban for pure ambience, and fades for a track built around parts
leaving and returning. Every lift replaced the blanket ban with the narrower one
that still holds - ambience keeps the core bans, the fading track keeps a ban on
fading out to silence at the end - because dropping a ban entirely tends to give
back the fault it was written for.

## Handing an instrument off

"The instruments change throughout" is an arrangement instruction and reads as
one only if the sections say who is playing. A rotation written as a global style
gets a track where everything plays at once and nothing changes. Written per
section - chip lead, then keyboard solo, then synth guitar, then the kit taking
over the figure the keyboard was playing - it becomes a sequence the model can
follow, and the global styles then only need to state that one lead solos at a
time and that they hand off rather than stack.

## Name what is silent

Handing the lead off is still not enough on its own, because it says nothing
about what the other twelve tracks are doing, and the answer turned out to be
"all of them, continuously". The fix is a voice budget - at most six parts
sounding at once - plus a section list that names what is **silent** as well as
what plays. A section that runs on four tracks and no drums has to be written
that way; nothing about asking for a quiet section produces it.

Tempo is worth spending on the same problem. Asking for a slower lead inside a
fast track fights the track, so a guitar that needs to be slow gets both a lower
BPM and phrasing pinned to about a note per bar. At 120 BPM a bar is two seconds,
which also makes two minutes exactly 60 bars.

The tick is the same note twice. Round one was told not to loop a heavy
two-note figure and answered with a fast single-note one instead, which reviewed
worse than the fault it replaced. So the ban has to name the repetition rather
than the instrument — anything holding one pitch on a fixed subdivision for the
whole track — and every chunk now also carries a positive rhythm direction, since
banning a thing without saying what replaces it just moves the problem.

## Stems over separate generations

Currently paused: the priority is one good full mix, so the split is opt-in
behind `--stems` rather than part of a normal run. It also costs about twice
what generating the track does. The notes below stand for when layering is worth
paying for; the stems already split sit under `elevenlabs/music/loops/stems/`.

Layering only works if the layers agree on the beat grid. Two generations at the
same nominal tempo do not: they drift in phase and land their downbeats in
different places, so they cannot be mixed against each other at runtime however
close their prompts were. Generating "a keys track" and "an ambient track"
separately produces two tracks, not two layers.

`/v1/music/stem-separation` splits one take into `piano`, `bass`, `drums`,
`guitar`, `other` and `vocals`. Those were played together, so they line up by
construction, and the split is the direct fix for a beat mixed too loud — its
level becomes a mixer value instead of a reason to regenerate. `other` collects
pads, sweeps and FX, which makes it the closest thing to an ambient-only bed.

`force_instrumental` cannot be sent alongside a composition plan, so vocals are
banned by negative style instead. The `vocals` stem is kept as the check on
whether that ban held.

Loop seams are still open. The account tier does not carry `pcm_44100` on the
music endpoints and there is no local ffmpeg, so loops are written as MP3 and
carry encoder padding at both ends — audible as a tick on repeat, which is why
the SFX loops above are WAV. Closing that needs ffmpeg on the machine, after
which the same crossfade the SFX loops use applies here.

## Generators

- `lib/elevenlabs.mjs` holds the shared API, credit, WAV and loop handling. The
  cue shape is documented at the top of that file.
- `generate_combat_sfx.mjs [cueName ...]` creates short combat cues in their
  category folders. With no arguments it rebuilds every cue still being
  auditioned, skipping `superseded` and `promoted` ones.
- `generate_engine_sfx.mjs [cueName ...]` creates the engine loops and boost
  bursts in `movement/`.

Any generator takes `--dry-run` to print the cues it would build without
spending credits, which is the cheap way to confirm a selection is right.
- `generate_music_beds.mjs [build|drive|drift ...]` creates long-form music in
  `elevenlabs/music/beds/`.
- `generate_music_loops.mjs [briefKey ...]` creates bar-aligned loops in
  `elevenlabs/music/loops/` from a composition plan and splits each one into
  stems. `--no-stems` skips the split; `--stems-only <path>` splits a file that
  already exists without generating anything.
- `generate_elevenlabs.mjs` is the original broad API probe. Its outputs now
  follow this directory layout.
- `probe_credits.mjs` checks the live ElevenLabs allowance.

## Wiki catalog

`catalog.json` is the record of music/SFX candidates the wiki shows: title,
status, BPM/key, file path, and the prompt that produced (or will produce)
each take. An audited take also carries `rating` (out of 10) and `review`, which
the wiki shows on the tile and in the inspector — the point is that the next
prompt is written against the recorded fault rather than from memory.
Rebuild the wiki after editing it (`cd wiki && npm run build`).
The Music & SFX page plays files that exist on disk and still shows briefs
that have not been generated yet.

The API key is read from the repository `.env`; generated audio never embeds
the key.

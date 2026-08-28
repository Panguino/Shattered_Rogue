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
- `generate_elevenlabs.mjs` is the original broad API probe. Its outputs now
  follow this directory layout.
- `probe_credits.mjs` checks the live ElevenLabs allowance.

The API key is read from the repository `.env`; generated audio never embeds
the key.

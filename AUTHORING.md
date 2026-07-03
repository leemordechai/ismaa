# AUTHORING — how to build a unit (the cheap way)

The unit pipeline is two phases with very different quality requirements. Match the model to the phase.

## Model & effort recommendation

| Phase | What happens | Model | Effort | Why |
|---|---|---|---|---|
| **Authoring** (the compact source file) | Writing dialect-accurate Arabic, honest Hebrew cognates, pedagogy, editorial prose | **Fable 5 (or the strongest available frontier model), high effort/thinking** | High | This is the only step where quality is irreplaceable. Dialect authenticity and cognate etymology are exactly where weaker models confidently hallucinate — and a wrong cognate or un-Palestinian phrasing ships straight into the learner's ear. The content rules say "when unsure, omit"; weaker models are bad at knowing when they're unsure. |
| **Pipeline** (compile → audio → QA → deploy) | Running documented scripts, checking exit codes, one screenshot, git push | **Sonnet 4.6, low effort** (or Fast mode) | Low | It's checklist work over deterministic scripts. `build-unit.mjs` validates the content so the model doesn't have to; the playbook below removes all discovery. Don't go below Sonnet — git/gh/quota edge cases still need judgment. |

Practical setups, best first:
1. **One session, two phases:** author on Fable 5, then keep going — the pipeline tail is now cheap because nothing is discovered, only executed. Simplest.
2. **Two sessions:** author the `.src.json` on Fable 5, `/clear`, run the pipeline on Sonnet pointing at this file ("Build unit N per AUTHORING.md"). Cheapest per token; the validator is the safety net.
3. Never: Haiku for anything that touches content, cognates, or pushes to main.

Where the tokens actually go (and what this framework cuts): the old workflow hand-wrote the full unit JSON (~50% boilerplate: audio paths, arPlain, match pairs duplicating vocab, repeated long keys) and rediscovered the pipeline each session (quota dance, retry pattern, QA loops). The compact source roughly **halves the authored tokens**, the compiler makes path/index errors impossible (no QA round-trips for typos), and this playbook makes the rest of the session near-zero reasoning. Expect a unit session to cost roughly half of Units 2–3, with identical output quality — the creative content is byte-for-byte still model-authored.

## The pipeline (playbook)

```bash
# 0. Quota probe + finish any leftovers from last unit (also tells you if today's quota is fresh):
node scripts/tts.mjs --jobs scripts/uN-retry.json --delay 6500   # if a retry file exists

# 1. AUTHOR content-src/unit-NN.src.json   (the only creative step — schema below)
#    Pick the L6 youtubeId first (Ask Project search) so it goes straight in.
#    BEFORE writing: read content-src/TAUGHT.md — the generated inventory of every
#    taught word, grammar point, and cognate. Don't re-teach; revisit deliberately.

# 2. Compile + validate (also emits split TTS manifests):
node scripts/build-unit.mjs content-src/unit-NN.src.json --split 94
#    --split: jobs for gemini-2.5-flash today (≤ remaining quota, max ~94 fresh); rest go to 3.1.
#    Fix validation errors in the source, recompile. Zero errors before proceeding.

# 3. Wire (two one-line edits): import unit in src/lib/content/index.ts; flip status
#    to 'ready' in src/lib/content/trajectory.ts. Then refresh the taught inventory:
node scripts/inventory.mjs        # regenerates content-src/TAUGHT.md (checked in)

# 4. Audio (~35 min background; ~190 jobs/unit):
node scripts/tts.mjs --jobs scripts/uN-audio-a.json --delay 6500; node scripts/tts.mjs --jobs scripts/uN-audio-b.json --delay 6500
#    Each tts.mjs exits 1 if ANY job failed — check both logs, not just the final exit code.

# 5. Cover while audio runs (imagen skill). Template prompt: editorial flat illustration,
#    landscape 4:3, [unit scene], warm cream bg #F8F5EE, palette olive #5C6B3C / clay #A8442F /
#    ink #211D18 / muted gold, paper-grain, tatreez zigzag along bottom edge only,
#    NO text/letters/numbers anywhere, no gloss/gradients/3D. Save static/img/covers/unit-NN.png. Eyeball it.

# 6. Build + minimal QA:
npm run build            # must be clean
npm run preview          # then: load all 6 lessons in browse, expect zero console errors,
                         # one viewport screenshot of one lesson. That's enough — the
                         # validator already guarantees structure.

# 7. Stragglers (expect 0–5 transient finishReason:OTHER failures):
node scripts/build-unit.mjs content-src/unit-NN.src.json --split 94 --only-missing
node scripts/tts.mjs --jobs scripts/uN-audio-a.json --delay 6500
#    A word that fails twice on 2.5 → retry once on 3.1 (--model gemini-3.1-flash-tts-preview,
#    simpler style). Still failing → defer to next session, note it in the commit.

# 8. Ship: rebuild, commit (style: "Unit N: <theme> — <key contents>"), push,
#    gh run watch, curl-verify 3 live URLs (lesson page, one wav, cover). Update README status
#    + memory. Done.
```

**Quota law (free tier):** 100 requests/model/day, resets midnight Pacific (~10:00 Israel). A unit ≈ 190 jobs = both models in one day, leftovers tomorrow. `finishReason: OTHER` failures consume quota; 429s don't.

**Voice roster (verified):** Sulafat (warm F — vocab/cloze/monologues), Algieba (smooth M), Charon (deep M — drivers, older men, news), Iapetus (clear M — grammar examples, drills). Two speakers max per dialogue (API limit).

## Compact source schema (`content-src/unit-NN.src.json`)

Top level: `n, arc, title, titleAr, mission, registerMix {street,news,shared}=100, lessons[]`.
Everything mechanical (ids → `uN-`, audio paths, arPlain, block order, match pairs) is derived — never write paths.

Each lesson: `title, titleAr, canDo, intro, weight?` plus any of (rendered in this fixed order — exercises always after the listening):

```jsonc
"vocab": [{ "id":"suq", "ar":"سوق", "en":"market", "he":"שוק", "pos":"noun", "reg":"street",
            "ex":["سؤال بالعربي.","English."], "root":"س و ق"?, "note":"..."?,
            "cog": ["shifted","שוק","story"]?, "matchEn":"shorter label for match"? }],

"dialogue": { "t":"Title", "tAr":"عنوان", "sit":"situation line",
              "voices": { "بياع":["Bayya3","Charon"], "زبون":["Zabun","Algieba"] },  // Arabic name -> [LatinLabel, GeminiVoice]
              // optional 3rd element "news": speaker reads in formal MSA broadcast style
              // (anchors, spokesmen): "المذيع":["Muthi3","Charon","news"]
              "lines": [["بياع","عربي","English"], ...] },

"listen":   { "t":..., "tAr":..., "brief":..., "speaker":"تيتا", "voice":"Sulafat",
              "sty": "full custom TTS style prompt"?,   // overrides the monologue style (e.g. mixed registers)
              "pre":["listen-for 1", ...],
              "lines":[["عربي","English"], ...],            // OR for real clips:
              "youtubeId":"....",                            // (then no lines/voice)
              "qs": [["prompt",["opt1","opt2","opt3","opt4"],0,"why?"], ...] },

"quiz":  [["prompt",[...],0,"why?"], ["@vocabid","Play it. What does it mean?",[...],0], ...],
"match": ["id1","id2",..., ["raw عربي","raw english","@idForAudio"?]],
"cloze": [["جملة فيها ____.","English.",["أ","ب","ج"],0], ...],
"grammar": [{ "ar":"الظاهرة", "exp":"explanation", "ex":[["عربي","English"],...] }],
"cognates": [["عربي","עברית","true|shifted|false-friend|loan","story"], ...]
```

Counts per content lesson (the Unit-2+ standard): 10 vocab, dialogue or listen (8–10 lines), quiz 5–6, match 7–8, cloze 5–6, grammar 2 points × 2–3 examples, cognates 2–4. L6 = review: intro, audio-first quiz (8, via `@id`), match 8 (mixed), cloze 6 (mixed), listen with `youtubeId` + `pre` only.

## Content rules (unchanged, binding)

CLAUDE.md rules apply: script-only, vowelized headwords, urban koine, honest cognates (omit when unsure), register tags, real media for free listening, sources field. The compiler enforces structure; **you** still own dialect accuracy and cognate honesty — that's why authoring stays on the strongest model.

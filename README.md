# اِسْمَع · Ismaʿ

A personal, listening-first web app for learning **Palestinian Arabic** — built for one learner going from A2 to B1 comprehension of real speech: street conversation, news discourse, and testimony from Gaza.

**The documents:**
- [PLAN.md](PLAN.md) — vision, pedagogy, architecture, phases, risks
- [CURRICULUM.md](CURRICULUM.md) — the full A2→B1 trajectory (5 arcs, 20 units)
- [RESOURCES.md](RESOURCES.md) — verified free resources, licensing posture, TTS pipeline

## Run

```bash
npm install
npm run dev        # local
npm run build      # static build (GitHub Pages-ready via BASE_PATH)
```

## Generate assets (build-time, local key)

```bash
# Audio (requires GEMINI_API_KEY in env):
node scripts/tts.mjs --jobs scripts/u1-audio.json --delay 7000

# Unit covers: imagen skill / scripts per RESOURCES.md §Images
```

The deployed site is fully static — no keys, no backend, progress lives in localStorage.

## Status

Phase 1 in progress: **Units 1–3 complete** (18 lessons, ~150 vocab items, 8 dialogues, 7 monologues, 3 real Ask Project street clips, ~570 audio files at slow learner pace). Exercise engine: quiz + tap-to-match + cloze after every listening section, answer order randomized per visit, number-discrimination drills, city-name listening, global 1×/0.8× speed toggle, SRS review queue with audio. One pending file: `node scripts/tts.mjs --jobs scripts/u3-retry.json` after quota reset (u3-servees.wav). Next: word-bank onboarding triage + Unit 4 السوق والقهوة.

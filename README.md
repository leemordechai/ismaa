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

**Arc 1 complete — Units 1–4** (24 lessons, ~200 vocab items, 10 dialogues, 10 monologues, 4 real Ask Project street clips, ~750 audio files at slow learner pace, all fully voiced). Exercise engine: quiz + tap-to-match + cloze after every listening section, randomized answers, number/city listening drills, 1×/0.8× speed toggle, SRS review with audio. Unit production is now compiler-driven — see [AUTHORING.md](AUTHORING.md) (compact source → `scripts/build-unit.mjs` → validated unit + TTS manifests). Next: word-bank onboarding triage, then Arc 2 خبر عاجل — the news register.

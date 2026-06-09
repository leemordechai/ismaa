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

Phase 0 (vertical slice): Unit 1 lessons 1–3 playable end-to-end, SRS review queue, trajectory map, Audio Lab naturalness gate with five generated samples awaiting the learner's verdict.

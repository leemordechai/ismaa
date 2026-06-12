# CLAUDE.md — 12-rule template

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

## Rule 1 — Think Before Coding
State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes
Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution
Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

## Rule 5 — Use the model only for judgment calls
Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory
Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them
If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 8 — Read before you write
Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 9 — Tests verify intent, not just behavior
Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

## Rule 11 — Match the codebase's conventions, even if you disagree
Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

---

# Project: Ismaʿ (اِسْمَع) — Palestinian Arabic by ear

Listening-first learning app for one learner (A2 → B1). Read PLAN.md before non-trivial work; CURRICULUM.md for content; RESOURCES.md for sources, licensing, and the TTS recipe.

## Stack & commands
- SvelteKit 2 + Svelte 5 (runes) + Tailwind 4, adapter-static, GitHub Pages (BASE_PATH env in workflow).
- `npm run dev` / `npm run build`. No test suite yet (Phase 0 slice).
- **New units: read AUTHORING.md and follow it exactly** — author `content-src/unit-NN.src.json` (compact schema), compile with `node scripts/build-unit.mjs` (validates + emits unit JSON + split TTS manifests). Model split per AUTHORING.md: frontier model for authoring, cheaper model fine for the pipeline.
- Audio: `node scripts/tts.mjs --jobs <manifest> --delay 6500` (GEMINI_API_KEY from env; recipe + voices in RESOURCES.md; quota = 100/model/day). Images: imagen skill, art direction template in AUTHORING.md.

## Content rules (non-negotiable)
1. **Arabic script only** — never add transliteration to learner-facing content. Headwords vowelized (Arc 1 fully; fade per CURRICULUM.md).
2. Dialect = urban Palestinian koine (Jerusalem/Ramallah); spellings like شو، هيك، إشي، هلّق. Tag register: `street` / `news` / `shared`.
3. Hebrew glosses on all vocab; cognate flags must be linguistically honest (true/shifted/false-friend/loan) — when unsure, omit rather than invent.
4. Every lesson lists verification sources in unit JSON `sources`. MADAR corpus = consult-only (license). Embed YouTube/Spotify; never download/copy media. Madrasa = deep-links only.
5. Authentic listening clips are always real media — TTS is banned for the `listen`-block clips that represent real voices; TTS only for vocab/dialogues, and only while the Audio Lab verdict allows it.
6. Content lives in `src/lib/content/unit-XX.json` matching `src/lib/types.ts`. The player is generic — new units are data, not code.

## Session budget note
Rule 6's 30k budget applies to maintenance sessions. Content-authoring sessions (a new unit + audio) legitimately run larger; flag at start, not after.
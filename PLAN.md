# Isma' (اِسْمَع) — Palestinian Arabic, by ear

**One-liner:** A personal, listening-first web app that takes one specific learner — A2, Hebrew/English speaker, historian of the present — from "several hundred words" to genuine B1 comprehension of real Palestinian speech: street conversation, news discourse, and testimony from Gaza.

This is not a Duolingo clone. There are no gems, no owls, no "the apple is red." The organizing promise is: **every session, you understand something real that you couldn't understand yesterday.**

---

## 1. Locked decisions (from kickoff Q&A, 2026-06-10)

| Decision | Choice | Consequence |
|---|---|---|
| Script | **Arabic script only**, no transliteration | Full harakat (vowel marks) early, fading by arc. Typography must be excellent. |
| Primary skill | **Listening comprehension** | Audio is the spine; reading/speaking serve listening. |
| Audio | **Real human recordings first; Gemini TTS second (gated); text-only acceptable fallback** | TTS ships only if it passes the user's own naturalness judgment in the built-in Audio Lab. |
| UI language | **English UI + Hebrew glosses** | Hebrew appears as a gloss layer and in a deliberate cognate system (חרב/حرب, שמע/سمع...). |
| Scope this session | Plan + vertical slice (Unit 1 working end-to-end) | |
| Deployment | **Static web app on GitHub Pages**, phone-usable | No backend, no accounts. Progress in localStorage with export/import. |
| Pace | **15–20 min/day** | ~2 weeks per unit → A2→B1 trajectory ≈ 9–10 months. |
| Content threads | Everyday backbone + **contemporary politics & news discourse** + **Gaza: war, testimony, reportage** | Oral-history and pop-culture threads explicitly deferred (can be added as arcs later). |

---

## 2. The learner (audience of one)

- A2, knows several hundred words; reads Arabic script comfortably.
- Native-level Hebrew: Hebrew–Arabic cognates are a massive discount on vocabulary cost (~30% of core vocabulary has a usable Hebrew bridge). The app treats this as a first-class feature, not trivia.
- Professional need: understands Palestinian politics and the Gaza war as a researcher; wants to hear sources directly rather than through translation.
- Risk profile: will quit if content is banal. Will not quit because content is hard or heavy.

## 3. Pedagogy (why the app is shaped this way)

1. **Comprehensible input, slightly above level (i+1).** Every lesson centers on a text/audio piece you can *almost* understand. Scaffolds (pre-taught vocab, chunked replays, transcript reveal) close the gap.
2. **Listening-first.** New language enters through the ear. Reading (script-only) supports and confirms; speaking prompts exist to force retrieval, not to drill production.
3. **Register honesty.** Palestinian reality is diglossic: anchors read MSA, people answer in dialect, and political nouns (احتلال، مستوطنة، وقف إطلاق النار) are shared. The app teaches **dialect as the matrix** and explicitly tags MSA-borrowed material instead of pretending the line doesn't exist.
4. **Spaced repetition without tedium.** An SM-2–derived queue (FSRS-style intervals) feeds 3 minutes of review at the start of each session. Review items are *sentences and audio snippets*, not bare words, wherever possible.
5. **Harakat fade.** Arc 1: fully vowelized. Arc 2: vowelized on first appearance only. Arc 3+: unvowelized except genuinely ambiguous forms — mirroring real-world text (news sites, subtitles, social media).
6. **Cognate engine, used honestly.** Hebrew bridges are flagged as *true* (שמע→سمع), *shifted* (חרב "sword"→حرب "war"), or *false friend* (לחם/لحم). Shifted cognates get a one-line story — these stick best.
7. **Heavy content, paced.** Gaza testimony is emotionally costly material. The trajectory interleaves it with everyday and procedural news content; it never ambushes, and lessons state what kind of material is coming.

## 4. Trajectory (summary — full detail in CURRICULUM.md)

Five arcs, 20 units, ~6 lessons each. At 15–20 min/day ≈ 2 weeks/unit → **~9–10 months to B1 listening**.

| Arc | Name | Units | Mission |
|---|---|---|---|
| 1 | **الشارع** · The Street | 1–4 | Consolidate A2 into *fast* comprehension: small talk at native speed, getting around, market, work & family. |
| 2 | **الأخبار** · The News | 5–9 | Enter the news register: "what happened today?", West Bank realities, Jerusalem, the vocabulary of occupation. |
| 3 | **غزة** · Gaza | 10–13 | War, displacement, hunger, ceasefire discourse; survivor testimony register; Gazan dialect notes. |
| 4 | **السياسة** · Politics | 14–17 | Factions, the PA, prisoners, protests and chants, negotiations discourse. |
| 5 | **أصوات** · Voices | 18–20 | Wean off scaffolds: full interviews and podcasts, strategies for unscripted speech. Exit exam: a 10-minute unscaffolded interview, understood. |

Each unit ends with **استماع حر** (free listening): one real, unsimplified clip with minimal scaffolding — the unit's proof of progress.

**Onboarding (one-time):** a word-bank triage of the ~600-word Levantine A2 frequency core — swipe known/unknown — so the SRS starts from his actual knowledge instead of assuming zero.

## 5. Product features

### MVP (this session — vertical slice)
- **Lesson player**: block-based lessons (vocab cards → dialogue → listening → cloze/quiz → cognate corner → wrap).
- **Unit 1** complete: 3 full lessons + unit structure for 6.
- **SRS review** (`/review`): localStorage queue, sentence-first cards, audio on cards where available.
- **Trajectory map** (home): the five arcs as an editorial "spine," progress visible at a glance.
- **Audio Lab** (`/audio-lab`): the TTS naturalness gate — listen to Gemini TTS samples A/B, record a verdict; the verdict flips the app between audio modes.
- Phone-usable, deployed.

### v1 (next sessions)
- Word-bank onboarding triage (~600-word list) seeding the SRS.
- **Listening Lab**: a library of real clips (embedded YouTube + CC-licensed audio) tagged by level/topic/register, each with scaffold layers (pre-vocab → chunked transcript → gloss).
- Arcs 1–2 content complete; per-word human audio wired in (see §7).
- Progress export/import (JSON file) for backup across devices.
- Shadowing mode on dialogues (listen → pause → repeat, self-scored).

### v2 (later)
- Arcs 3–5 content; harakat-fade automation; dictation exercises (type what you hear).
- Frequency-aware "word autopsy" pages (root, family, register, corpus examples from Curras/MADAR).
- Optional: oral-history arc (Nakba testimony) and pop-culture arc (DAM, stand-up) — the two threads deferred at kickoff.

### Explicit non-goals
No accounts, no server, no social features, no streaks-as-guilt (a quiet "last studied" note instead), no gamification currency, no chatbot conversation partner (TTS isn't good enough to model a dialect interlocutor honestly — revisit in v2).

## 6. Content system

- **Storage:** one JSON file per unit (`src/lib/content/unit-XX.json`), schema in `src/lib/types.ts`. Content is data, the player is code — adding Unit 7 means writing JSON, no new components.
- **Item anatomy (vocab):** Arabic (vowelized + plain), English, Hebrew gloss, root, part of speech, register tag (`street` / `news` / `shared-MSA`), cognate note (`true|shifted|false-friend` + one-liner), example sentence (ar/en), audio ref.
- **Dialect standard:** urban Palestinian koine (Jerusalem/Ramallah) as the default; Gazan variants noted in Arc 3 where they matter (e.g., pronunciation of ق). Orthography follows common Palestinian written-dialect conventions (شو، هلّق، بدّي، مش).
- **Authenticity QA:** every authored dialogue gets checked against at least one reference (Madrasa dictionary, Living Arabic, Curras corpus — MADAR consult-only, its license forbids shipping content) before it ships; anything unverifiable gets rewritten around verified language. A `sources` field on each lesson records what it was checked against.
- **Authoring pipeline:** author JSON → run `scripts/tts.mjs` (or link real audio) → `npm run build`. Images per unit via the imagen pipeline (editorial illustration style, no text in images).

## 7. Audio strategy (the "must sound real" requirement)

Priority order, per asset type:

| Asset | Source | Notes |
|---|---|---|
| Single words | **Gemini TTS** *if gated in* (research verdict: no free human per-word audio exists — Madrasa's recordings are sparse and not publicly fetchable, Tatoeba ajp has zero audio) | Madrasa deep-links per word remain the lookup/verification reference. |
| Example sentences | Gemini TTS *if gated in*; Tatoeba ajp text pairs (CC-BY, incl. a Hebrew-links file) imported as seed text | |
| Dialogues | Gemini TTS multi-speaker *if gated in* (verified working: Sulafat+Algieba two-speaker dialogues); else text + real-clip substitution | |
| Authentic listening | **Real media only**: timestamped YouTube embeds (The Ask Project, Wattan, Khabar Press, Maha), Spotify podcast embeds — never TTS | The heart of the app; TTS is banned here by design. |

**The gate:** `/audio-lab` plays the generated Gemini TTS samples (already produced during this session if the API key was reachable). The user grades them. Verdict `real enough` → TTS fills the gaps above. Verdict `mechanical` → those slots fall back to text + linked human audio, and the plan stays fully functional (his own choice: "text-only is fine").

**Licensing posture:** embed and link, don't copy. YouTube via standard iframes (permitted), Tatoeba audio under its CC terms with attribution, Madrasa audio linked or used privately for personal study — not redistributed in a public repo. Anything generated (TTS, imagen) is ours.

## 8. Visual design

Direction: **a serious magazine, not a toy** — fitting content about politics and war. Editorial print aesthetic on warm paper; the Arabic script treated as the hero typographic element, not an afterthought.

- **Type:** Amiri (Naskh, excellent harakat) for Arabic content, large and confident; Fraunces for English editorial display; Outfit for UI; IBM Plex Sans Arabic for Arabic UI chrome; Frank Ruhl Libre for Hebrew glosses.
- **Palette:** warm paper `#F8F5EE`, warm ink `#211D18` (no pure black), olive `#5C6B3C` and clay `#A8442F` accents (tatreez-adjacent, desaturated), hairlines `#DDD5C4`.
- **Layout:** CSS grid, asymmetric; the trajectory home page reads like a table of contents of a long-form piece, not a level map. Proper bidi handling (`dir` per element, logical properties).
- **Motion:** `cubic-bezier(0.16,1,0.3,1)`, transform/opacity only, IntersectionObserver reveals with stagger. Tactile press states (`active:scale-[0.98]`).
- **Imagery:** imagen-generated editorial illustrations per unit — restrained, geometric, olive/clay palette, no AI-slop gloss, **no rendered text** (image models garble Arabic).

## 9. Architecture

```
SvelteKit 2 + Svelte 5 + Tailwind 4 → adapter-static → GitHub Pages
├── src/lib/content/unit-XX.json     ← curriculum as data
├── src/lib/types.ts                 ← content schema
├── src/lib/srs.ts                   ← SM-2-derived scheduler (pure functions)
├── src/lib/progress.svelte.ts       ← localStorage-backed progress store (runes)
├── src/routes/                      ← / (trajectory) · /unit/[id] · /unit/[id]/lesson/[n] · /review · /audio-lab
├── scripts/tts.mjs                  ← Gemini TTS batch generation (build-time, key stays local)
└── static/audio/, static/img/       ← pre-generated assets, committed
```

Key property: **all generation happens at build time on this machine.** The deployed site is inert static files — no API keys exposed, works offline once cached, costs nothing to host.

## 10. Phases & milestones

| Phase | Scope | Done when |
|---|---|---|
| **0 — Slice** (today) | Scaffold, design system, Unit 1 (3 lessons live), SRS, trajectory map, Audio Lab with real samples, deployed | Lee can do Lesson 1 on his phone and grade the TTS. |
| **1 — Arc 1** | Units 1–4 complete, word-bank onboarding triage, per-word human audio integration | Daily 15-min habit is fully supported for ~2 months of material. |
| **2 — Listening Lab + Arc 2** | Clip library with scaffolds; news-register units 5–9 | First real news clip understood without transcript. |
| **3 — Arcs 3–4** | Gaza + Politics content; harakat fade; dictation | The register he actually needs professionally. |
| **4 — Arc 5 + polish** | Long-form listening, exit assessment, v2 backlog triage | A 10-min unscaffolded interview, understood ≥80%. |

Phase 1–4 sessions are content-heavy, not code-heavy: the engine is built once (Phase 0–2), then each phase is mostly authoring + audio sourcing.

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Gemini TTS Arabic sounds MSA-ish or robotic | The gate (§7). Architecture treats audio per-slot as optional; text-only path explicitly accepted by the user. |
| Dialect errors in authored content (I am not a native speaker) | Authenticity QA against Madrasa/corpora (§6); prefer adapting verified corpus sentences over free composition; `sources` field per lesson; flag low-confidence items in-app with a subtle mark. |
| Copyright (Madrasa audio, news clips) | Embed/link, don't copy (§7). Public repo contains only original/CC/generated assets. |
| Heavy content burns out the learner | Interleaving (§3.7); Arc 3 lessons labeled; everyday thread never disappears. |
| Scope creep (the eternal app-building trap) | Phases gate features; non-goals list (§5); content-over-code rule after Phase 2. |
| localStorage wiped → progress lost | Export/import in v1; deployed app nags gently to export monthly. |

## 12. Open questions for Lee (non-blocking)

1. Audio Lab verdict — after listening to the samples: real enough, or text + linked human audio only?
2. The ~600-word onboarding triage list: fine to base it on the Madrasa course vocabulary + a Levantine frequency list?
3. Public vs private repo (Pages currently implies public for free accounts) — any issue with the app being publicly visible under your GitHub account?

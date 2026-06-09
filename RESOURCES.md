# RESOURCES — verified 2026-06-10

Everything below was live-verified by research agents on this date unless marked *inferred*. Integration column is the legal/practical posture for this app.

## Dictionaries & reference

| Resource | URL | What | Audio | License | Integration |
|---|---|---|---|---|---|
| **Madrasa dictionary (מילון מדרסה)** | https://milon.madrasafree.com — entries at `word.asp?id=N` | 9,059 Hebrew-glossed, Hebrew-transliterated Palestinian Arabic words; topic tags; only 118 example sentences | 1,216 recordings exist but are **not publicly fetchable** (no URL pattern in served HTML) | All rights reserved | **Deep-link per word** for lookup/verification. No bulk import. |
| **Living Arabic Project / Lughatuna** | https://www.livingarabic.com | Large Levantine dictionary (Arabic↔English, Arabic↔Arabic), root search | None | Web free, app paid, no API | Link-only; authoring verification |
| **Wiktionary (ajp entries + Swadesh list)** | en.wiktionary.org | South Levantine entries, conjugations | Sparse | CC BY-SA | Quotable with attribution |
| **Levanti** | https://levantitranslate.com | Free Hebrew↔spoken-Levantine AI translator | — | Free tool | Drafting aid only — output must be verified before shipping |

## Corpora & data

| Resource | URL | What | License | Use |
|---|---|---|---|---|
| **Curras v2 (Birzeit)** | https://sina.birzeit.edu/currasat/about-en.html | ~56k-token morphologically annotated Palestinian corpus | **CC BY 4.0** (download via Google Form) | Authoring verification + future "word autopsy" examples. Fill the form once. |
| **Tatoeba ajp** | https://downloads.tatoeba.org/exports/per_language/ajp/ | 209 sentences; **`ajp-heb_links.tsv.bz2` = ready Palestinian↔Hebrew pairs**; `ajp-eng` too | CC BY 2.0 FR | Import as seed sentence pairs (tiny but open). **Zero audio** — verified. |
| **MADAR (incl. Jerusalem dialect)** | https://camel.abudhabi.nyu.edu/madar-parallel-corpus/ | 25-city parallel corpus + 1,045-concept lexicon | **Research-only, no redistribution** | ⚠️ Reference/consultation only. Never ship its content in the app. |
| **Overworded Levantine frequency list** | https://overworded.com/frequency/apc | Top ~3,000 Levantine words (from lyrics), CSV | *inferred free* | Candidate basis for the onboarding triage list (cross-check register) |

## Authentic listening (the Listening Lab pipeline)

| Source | URL | Dialect/register | A2-B1 fit | Integration |
|---|---|---|---|---|
| **The Ask Project** | https://www.youtube.com/@coreygs | West Bank street answers, English subs | **Best graded source**: one question, many short self-contained answers | Timestamped iframe embeds |
| **Wattan News (وطن)** | https://www.youtube.com/@WattanNews | Ramallah vox-pops, news packages | B1 | Embeds |
| **Khabar Press (وكالة خبر)** | https://www.youtube.com/@khbrpress1 | **Gaza-dialect** street interviews | B1 — Arc 3 source | Embeds |
| **Quds News Network** | https://www.youtube.com/@QudsNPS | News clips, dialect interviewees | B1+ | Embeds |
| **Learn Arabic with Maha** | https://www.youtube.com/@LearnArabicwithMaha | Palestinian (Nazareth), teaching register | A2 — gentlest authentic input | Embeds (e.g. `DboWZ-J7iXQ` Palestinian lesson 1) |
| **Sowt podcasts / قصص من فلسطين** | https://www.sowt.com · Spotify `5IfzCyEiVFxuKMUXmR7jex` | Colloquial podcast network | B1+ → Arc 5 | Spotify embeds |
| **Aswaat Arabiyya (UT Austin)** | https://www.laits.utexas.edu/aswaat/ | TV clips, novice→superior, ʕammiyya/fuṣḥa section | Mixed (much MSA) | Link-only |

**YouTube rule (verified):** standard iframe embeds = permitted; downloading/re-serving = prohibited. Embed, never extract.

## Audio generation (verified working on this machine)

- **Key:** `GEMINI_API_KEY` env var (user-level). Send as `x-goog-api-key` header. Never in URLs, never committed.
- **Script:** `scripts/tts.mjs` (zero-dep Node, single + `--jobs` batch mode, retry on 429/5xx, writes RIFF/WAV from 24kHz 16-bit PCM). Sample definitions: `scripts/tts-samples.json`.
- **Models:** `gemini-2.5-flash-preview-tts` ($10/1M audio tokens ≈ **$0.017 per 1k chars**, free tier exists) · `gemini-3.1-flash-tts-preview` (2× price, possibly better dialect) · Pro variant rarely needed.
- **Voices verified:** Sulafat (warm F), Algieba (smooth M), Charon (deep M — news register), Iapetus (clear M). Two-speaker dialogues via `multiSpeakerVoiceConfig`.
- **Dialect recipe:** prefix a *reading direction* (not a persona — personas trigger 400s): "TTS the following… authentic spoken Palestinian Levantine Arabic (اللهجة الفلسطينية المحكية) exactly as natives from Ramallah chat — NOT Modern Standard Arabic… Pronounce شو صار as 'shu sar', إشي as 'ishi'." Transliteration hints are the strongest dialect lever.
- **Cost reality:** full curriculum corpus (~1,000 words + 50 dialogues) ≈ **$0.50–$1.00 total** on 2.5 Flash.
- **Generated samples for the Audio Lab gate** (in `static/audio/tts-samples/`): `sample-1-dialogue.wav` (Sulafat+Algieba, 2.5), `sample-1b-dialogue-gemini31.wav` (same pair, 3.1 — A/B the models), `sample-2-news.wav` (Charon news register), `sample-3-vocab.wav` (Sulafat flashcard), `sample-3b-vocab-iapetus.wav` (Iapetus flashcard).
- **Fallbacks ruled out:** Google Cloud TTS `ar-XA`/Chirp3 = MSA only, no dialect control. Open-source (XTTS v2, MMS) = below the bar. If Gemini fails the gate → text + embeds, per plan.

## Images

- **Model:** `gemini-3-pro-image-preview` via the existing imagen skill (same `GEMINI_API_KEY`).
- Art direction: editorial illustration, restrained geometry, olive/clay palette, **no text in images** (models garble Arabic script).

## The honest gaps (verified, so the plan doesn't pretend)

1. **Per-word human audio does not exist freely.** Options if TTS fails the gate: record a native speaker (~1–2k core words is a weekend project), Playaling 7-day trial for evaluation, Forvo (unverified coverage).
2. **Sentence-level human audio**: same gap. Tatoeba's famous audio doesn't exist for ajp.
3. Madrasa is a *word* dictionary (118 sentences) — verification yes, sentence mining no.
4. Hebrew-paired open data is tiny (one Tatoeba file). The Hebrew-gloss layer is authored, not imported.

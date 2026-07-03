#!/usr/bin/env node
// Unit compiler: compact authoring source -> full unit JSON + TTS manifests.
//
//   node scripts/build-unit.mjs content-src/unit-04.src.json [--split 94] [--only-missing]
//
// Reads the compact source (schema: AUTHORING.md), validates it, and writes:
//   src/lib/content/unit-NN.json        (full schema matching src/lib/types.ts)
//   scripts/uN-audio-a.json             (first --split jobs, default TTS model)
//   scripts/uN-audio-b.json             (remainder, gemini-3.1-flash-tts-preview)
//
// Everything mechanical is derived here — audio paths, arPlain, match pairs,
// block order — so the authored source carries only the content itself.

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const STYLE = {
	word: "Read aloud only the following Arabic vocabulary word, exactly once, very slowly and clearly with a calm teaching pace, in spoken Palestinian Levantine pronunciation (NOT Modern Standard Arabic), warm tone:",
	sentence:
		"Read aloud the following short Palestinian Levantine Arabic sentence exactly once, slowly and very clearly — a calm, learner-friendly pace with each word articulated, but natural authentic dialect pronunciation (NOT Modern Standard Arabic):",
	line: "Read aloud this single line of spoken Palestinian Levantine Arabic dialogue exactly once, slowly and clearly — calm learner-friendly pace, but staying casual and authentically dialectal (NOT Modern Standard Arabic):",
	dialogue:
		"TTS the following everyday conversation. Both speakers use authentic spoken Palestinian Levantine Arabic (اللهجة الفلسطينية المحكية) exactly as natives from Ramallah talk — NOT Modern Standard Arabic. Speak noticeably SLOWER than natural conversation: calm, learner-friendly pacing, clear articulation, brief pauses between turns — while keeping the casual dialect pronunciation. Pronounce شو صار as 'shu sar', إشي as 'ishi', هلّق as 'hallaq'.",
	monologue:
		"Read aloud the following monologue in authentic spoken Palestinian Levantine Arabic (اللهجة الفلسطينية المحكية) — NOT Modern Standard Arabic. A warm speaker from Ramallah telling a story to a neighbor. Speak noticeably slower than natural: calm, learner-friendly pace with small pauses between sentences, clear articulation, but keep the casual dialect pronunciation (إشي as 'ishi').",
	newsline:
		"Read aloud this single line of an Arabic television news broadcast exactly once, slowly and clearly for a learner: formal Modern Standard Arabic (الفصحى), measured news-anchor delivery, official broadcast tone — NOT colloquial dialect."
};

const VOICE = { vocab: "Sulafat", grammar: "Iapetus", cloze: "Sulafat" };
const COG_KINDS = new Set(["true", "shifted", "false-friend", "loan"]);

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const splitRaw = Number(
	process.argv.find((a) => a.startsWith("--split="))?.slice(8) ??
		(process.argv.includes("--split") ? process.argv[process.argv.indexOf("--split") + 1] : NaN)
);
const splitArg = Number.isFinite(splitRaw) ? splitRaw : 94;
const onlyMissing = process.argv.includes("--only-missing");
const srcPath = args[0];
if (!srcPath) {
	console.error("Usage: node scripts/build-unit.mjs content-src/unit-NN.src.json [--split N] [--only-missing]");
	process.exit(1);
}

const raw = await readFile(srcPath, "utf8");
const src = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);

const errors = [];
const err = (m) => errors.push(m);

const N = src.n;
const u = `u${N}`;
const nn = String(N).padStart(2, "0");
const stripHarakat = (s) => s.replace(/[ؐ-ًؚ-ٰٟـۖ-ۭ]/g, "");

// ---- collect vocab registry (for match/quiz @refs) ----
const vocabIndex = {};
for (const [li, lesson] of (src.lessons ?? []).entries()) {
	for (const v of lesson.vocab ?? []) {
		const id = `${u}-${v.id}`;
		if (vocabIndex[id]) err(`L${li + 1}: duplicate vocab id ${v.id}`);
		vocabIndex[id] = v;
	}
}

const wordAudio = (vid) => `audio/tts/${u}/${vid}.wav`;

function compileQuizQ(q, where) {
	let arr = [...q];
	let audio;
	if (typeof arr[0] === "string" && arr[0].startsWith("@")) {
		const vid = `${u}-${arr[0].slice(1)}`;
		if (!vocabIndex[vid]) err(`${where}: quiz audio ref ${arr[0]} not a vocab id`);
		audio = wordAudio(vid);
		arr = arr.slice(1);
	}
	const [prompt, options, answer, why] = arr;
	if (!Array.isArray(options) || options.length < 2) err(`${where}: quiz options malformed`);
	if (typeof answer !== "number" || answer < 0 || answer >= (options?.length ?? 0))
		err(`${where}: quiz answer index out of range`);
	const out = { prompt, options, answer };
	if (audio) out.audio = audio;
	if (why) out.why = why;
	return out;
}

const lessons = [];
for (const [li, L] of (src.lessons ?? []).entries()) {
	const ln = li + 1;
	const where = `L${ln}`;
	for (const k of ["title", "titleAr", "canDo"]) if (!L[k]) err(`${where}: missing ${k}`);
	const blocks = [];

	if (L.intro) blocks.push({ type: "intro", body: L.intro });

	if (L.vocab?.length) {
		blocks.push({
			type: "vocab",
			title: L.vocabTitle ?? "New words",
			items: L.vocab.map((v) => {
				const id = `${u}-${v.id}`;
				if (!v.ar || !v.en || !v.he || !v.pos || !v.reg) err(`${where}/${v.id}: vocab missing core field`);
				if (!Array.isArray(v.ex) || v.ex.length !== 2) err(`${where}/${v.id}: ex must be [ar,en]`);
				const item = {
					id,
					ar: v.ar,
					arPlain: stripHarakat(v.ar),
					en: v.en,
					he: v.he,
					pos: v.pos,
					register: v.reg,
					example: { ar: v.ex[0], en: v.ex[1] },
					audio: wordAudio(id),
					audioEx: `audio/tts/${u}/${id}-ex.wav`
				};
				if (v.root) item.root = v.root;
				if (v.note) item.note = v.note;
				if (v.cog) {
					const [kind, he, note] = v.cog;
					if (!COG_KINDS.has(kind)) err(`${where}/${v.id}: bad cognate kind '${kind}'`);
					item.cognate = { kind, he, note };
				}
				return item;
			})
		});
	}

	if (L.dialogue) {
		const D = L.dialogue;
		const voices = {};
		for (const [speaker, [label, voice, mode]] of Object.entries(D.voices ?? {})) {
			voices[speaker] = { label, voice };
			if (mode === "news") voices[speaker].news = true;
			else if (mode !== undefined) err(`${where}: dialogue voice mode '${mode}' (only 'news' supported)`);
		}
		const lines = (D.lines ?? []).map(([speaker, ar, en], i) => {
			if (!voices[speaker]) err(`${where}: dialogue speaker '${speaker}' missing from voices`);
			return { speaker, ar, en, audio: `audio/tts/${u}/d${ln}-l${String(i + 1).padStart(2, "0")}.wav` };
		});
		blocks.push({
			type: "dialogue",
			title: D.t,
			titleAr: D.tAr,
			situation: D.sit,
			audio: `audio/tts/${u}/d${ln}.wav`,
			ttsVoices: voices,
			lines
		});
	}

	if (L.listen) {
		const S = L.listen;
		const block = {
			type: "listen",
			title: S.t,
			titleAr: S.tAr,
			brief: S.brief,
			preQuestions: S.pre ?? [],
			transcript: (S.lines ?? []).map(([ar, en]) => ({ speaker: S.speaker ?? "", ar, en })),
			questions: (S.qs ?? []).map((q, qi) => compileQuizQ(q, `${where}/listen q${qi + 1}`))
		};
		if (S.youtubeId) {
			block.youtubeId = S.youtubeId;
		} else {
			if (!S.lines?.length) err(`${where}: listen needs lines or youtubeId`);
			block.audio = `audio/tts/${u}/listen${ln}.wav`;
			block.ttsVoice = S.voice ?? VOICE.vocab;
			if (S.sty) block.ttsStyle = S.sty;
		}
		blocks.push(block);
	}

	if (L.quiz?.length) {
		blocks.push({
			type: "quiz",
			title: L.quizTitle ?? "Did you catch it?",
			questions: L.quiz.map((q, qi) => compileQuizQ(q, `${where}/quiz q${qi + 1}`))
		});
	}

	if (L.match?.length) {
		blocks.push({
			type: "match",
			title: L.matchTitle ?? "Match",
			pairs: L.match.map((m) => {
				if (typeof m === "string") {
					const vid = `${u}-${m}`;
					const v = vocabIndex[vid];
					if (!v) {
						err(`${where}: match ref '${m}' not a vocab id`);
						return { ar: m, en: "?" };
					}
					return { ar: v.ar, en: v.matchEn ?? v.en, audio: wordAudio(vid) };
				}
				const [ar, en, ref] = m;
				const pair = { ar, en };
				if (ref?.startsWith("@")) {
					const vid = `${u}-${ref.slice(1)}`;
					if (!vocabIndex[vid]) err(`${where}: match audio ref ${ref} not a vocab id`);
					pair.audio = wordAudio(vid);
				}
				return pair;
			})
		});
	}

	if (L.cloze?.length) {
		blocks.push({
			type: "cloze",
			title: L.clozeTitle ?? "Fill the gap",
			items: L.cloze.map(([ar, en, options, answer], ci) => {
				if (!ar?.includes("____")) err(`${where}/cloze ${ci + 1}: missing ____`);
				if (typeof answer !== "number" || answer < 0 || answer >= options.length)
					err(`${where}/cloze ${ci + 1}: answer out of range`);
				return { ar, en, options, answer, audio: `audio/tts/${u}/c${ln}-${ci + 1}.wav` };
			})
		});
	}

	if (L.grammar?.length) {
		blocks.push({
			type: "grammar",
			title: L.grammarTitle ?? "Pattern",
			points: L.grammar.map((p, pi) => ({
				ar: p.ar,
				explanation: p.exp,
				examples: (p.ex ?? []).map(([ar, en], ei) => ({
					ar,
					en,
					audio: `audio/tts/${u}/g${ln}-${pi + 1}-${ei + 1}.wav`
				}))
			}))
		});
	}

	if (L.cognates?.length) {
		blocks.push({
			type: "cognates",
			title: "Hebrew bridges",
			items: L.cognates.map(([ar, he, kind, story]) => {
				if (!COG_KINDS.has(kind)) err(`${where}: cognates bad kind '${kind}'`);
				return { ar, he, kind, story };
			})
		});
	}

	const lesson = { n: ln, title: L.title, titleAr: L.titleAr, canDo: L.canDo, status: "ready", blocks };
	if (L.weight) lesson.weight = L.weight;
	lessons.push(lesson);
}

const mix = src.registerMix ?? {};
if ((mix.street ?? 0) + (mix.news ?? 0) + (mix.shared ?? 0) !== 100) err("registerMix must sum to 100");

const unit = {
	id: `unit-${nn}`,
	n: N,
	arc: src.arc,
	title: src.title,
	titleAr: src.titleAr,
	mission: src.mission,
	cover: `img/covers/unit-${nn}.png`,
	registerMix: mix,
	sources: src.sources ?? [
		"Forms cross-checked against Madrasa dictionary and Living Arabic Project (Levantine)",
		"Urban Palestinian koine (Jerusalem/Ramallah); native-speaker review pending — low-confidence items avoided"
	],
	lessons
};

// ---- TTS manifest (same walk as gen-manifest.mjs, against the compiled unit) ----
const jobs = [];
const seen = new Set();
const add = (job) => {
	if (!job.text || !job.out || seen.has(job.out)) return;
	seen.add(job.out);
	if (onlyMissing && existsSync(job.out)) return;
	jobs.push(job);
};
const toStatic = (ref) => `static/${ref}`;

for (const lesson of unit.lessons) {
	for (const block of lesson.blocks) {
		if (block.type === "vocab") {
			for (const item of block.items) {
				add({ text: item.ar, out: toStatic(item.audio), voice: VOICE.vocab, style: STYLE.word });
				add({ text: item.example.ar, out: toStatic(item.audioEx), voice: VOICE.vocab, style: STYLE.sentence });
			}
		} else if (block.type === "dialogue") {
			const text = block.lines.map((l) => `${block.ttsVoices[l.speaker]?.label}: ${l.ar}`).join("\n");
			const speakers = Object.values(block.ttsVoices).map((v) => `${v.label}=${v.voice}`).join(",");
			const newsLabels = Object.values(block.ttsVoices).filter((v) => v.news).map((v) => v.label);
			const dialogueStyle = newsLabels.length
				? STYLE.dialogue +
					` EXCEPTION: ${newsLabels.join(" and ")} speaks in formal Modern Standard Arabic (الفصحى) with measured TV-news broadcast delivery — clear, official, NOT dialectal. Any other speaker stays fully colloquial Palestinian.`
				: STYLE.dialogue;
			add({ text, out: toStatic(block.audio), speakers, style: dialogueStyle });
			for (const line of block.lines)
				add({
					text: line.ar,
					out: toStatic(line.audio),
					voice: block.ttsVoices[line.speaker]?.voice ?? VOICE.vocab,
					style: block.ttsVoices[line.speaker]?.news ? STYLE.newsline : STYLE.line
				});
		} else if (block.type === "listen" && block.audio) {
			add({ text: block.transcript.map((l) => l.ar).join(" "), out: toStatic(block.audio), voice: block.ttsVoice, style: block.ttsStyle ?? STYLE.monologue });
		} else if (block.type === "grammar") {
			for (const p of block.points) for (const ex of p.examples) add({ text: ex.ar, out: toStatic(ex.audio), voice: VOICE.grammar, style: STYLE.sentence });
		} else if (block.type === "cloze") {
			for (const item of block.items)
				add({ text: item.ar.replace("____", item.options[item.answer]), out: toStatic(item.audio), voice: VOICE.cloze, style: STYLE.sentence });
		}
	}
}

if (errors.length) {
	console.error(`VALIDATION FAILED (${errors.length}):`);
	for (const e of errors) console.error("  - " + e);
	process.exit(1);
}

const outUnit = `src/lib/content/unit-${nn}.json`;
await writeFile(outUnit, JSON.stringify(unit, null, "\t") + "\n", "utf8");
const a = jobs.slice(0, splitArg);
const b = jobs.slice(splitArg).map((j) => ({ ...j, model: "gemini-3.1-flash-tts-preview" }));
await writeFile(`scripts/${u}-audio-a.json`, JSON.stringify(a, null, "\t"), "utf8");
await writeFile(`scripts/${u}-audio-b.json`, JSON.stringify(b, null, "\t"), "utf8");

const vocabCount = Object.keys(vocabIndex).length;
console.log(`OK unit-${nn}: ${lessons.length} lessons, ${vocabCount} vocab, ${jobs.length} audio jobs -> ${outUnit}`);
console.log(`   manifests: scripts/${u}-audio-a.json (${a.length} @ 2.5-flash), scripts/${u}-audio-b.json (${b.length} @ 3.1-flash)`);
console.log(`   next: node scripts/tts.mjs --jobs scripts/${u}-audio-a.json --delay 6500; node scripts/tts.mjs --jobs scripts/${u}-audio-b.json --delay 6500`);

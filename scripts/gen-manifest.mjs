#!/usr/bin/env node
// Build a TTS job manifest from a unit content JSON.
// Walks vocab (word + example), dialogues (full multi-speaker + per-line),
// listen monologues, grammar examples, and cloze completed sentences.
//
//   node scripts/gen-manifest.mjs [unitJson] [outJson] [--only-missing]
//
// Default: regenerates everything the unit references (use --only-missing to
// skip files already on disk, e.g. after a partial failure).

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
		"Read aloud the following monologue in authentic spoken Palestinian Levantine Arabic (اللهجة الفلسطينية المحكية) — NOT Modern Standard Arabic. A warm, chatty woman from Ramallah telling a neighbor a story. Speak noticeably slower than natural: calm, learner-friendly pace with small pauses between sentences, clear articulation, but keep the casual dialect pronunciation (إشي as 'ishi')."
};

const VOICE = { vocab: "Sulafat", grammar: "Iapetus", cloze: "Sulafat" };

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const onlyMissing = process.argv.includes("--only-missing");
// Override the TTS model for every job (e.g. when one model's daily quota is spent):
//   --model=gemini-3.1-flash-tts-preview
const modelArg = process.argv.find((a) => a.startsWith("--model="))?.slice(8);
const unitPath = args[0] ?? "src/lib/content/unit-01.json";
const outPath = args[1] ?? "scripts/u1-audio-v2.json";

const raw = await readFile(unitPath, "utf8");
const unit = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);

const jobs = [];
const seen = new Set();

function add(job) {
	if (!job.text || !job.out) return;
	if (seen.has(job.out)) return;
	seen.add(job.out);
	if (onlyMissing && existsSync(job.out.replace(/^static\//, "static/"))) return;
	if (modelArg) job.model = modelArg;
	jobs.push(job);
}

const toStatic = (ref) => `static/${ref}`;

for (const lesson of unit.lessons) {
	for (const block of lesson.blocks ?? []) {
		if (block.type === "vocab") {
			for (const item of block.items) {
				if (item.audio) add({ text: item.ar, out: toStatic(item.audio), voice: VOICE.vocab, style: STYLE.word });
				if (item.audioEx)
					add({ text: item.example.ar, out: toStatic(item.audioEx), voice: VOICE.vocab, style: STYLE.sentence });
			}
		} else if (block.type === "dialogue") {
			const voices = block.ttsVoices ?? {};
			if (block.audio) {
				const text = block.lines
					.map((l) => `${voices[l.speaker]?.label ?? l.speaker}: ${l.ar}`)
					.join("\n");
				const speakers = Object.values(voices)
					.map((v) => `${v.label}=${v.voice}`)
					.join(",");
				add({ text, out: toStatic(block.audio), speakers, style: STYLE.dialogue });
			}
			for (const line of block.lines) {
				if (line.audio)
					add({
						text: line.ar,
						out: toStatic(line.audio),
						voice: voices[line.speaker]?.voice ?? VOICE.vocab,
						style: STYLE.line
					});
			}
		} else if (block.type === "listen") {
			if (block.audio && block.transcript?.length) {
				const text = block.transcript.map((l) => l.ar).join(" ");
				add({ text, out: toStatic(block.audio), voice: block.ttsVoice ?? VOICE.vocab, style: STYLE.monologue });
			}
		} else if (block.type === "grammar") {
			for (const point of block.points) {
				for (const ex of point.examples) {
					if (ex.audio) add({ text: ex.ar, out: toStatic(ex.audio), voice: VOICE.grammar, style: STYLE.sentence });
				}
			}
		} else if (block.type === "cloze") {
			for (const item of block.items) {
				if (item.audio)
					add({
						text: item.ar.replace("____", item.options[item.answer]),
						out: toStatic(item.audio),
						voice: VOICE.cloze,
						style: STYLE.sentence
					});
			}
		}
	}
}

await writeFile(outPath, JSON.stringify(jobs, null, "\t"), "utf8");
console.log(`${jobs.length} jobs -> ${outPath}${onlyMissing ? " (only missing)" : ""}`);

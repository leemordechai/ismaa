#!/usr/bin/env node
// Taught-content inventory: regenerates content-src/TAUGHT.md from the compiled
// unit JSONs. Run after every build-unit.mjs — the authoring reference for
// "has this word/pattern/cognate been taught already?"
//
//   node scripts/inventory.mjs

import { readFile, writeFile, readdir } from "node:fs/promises";

const dir = "src/lib/content";
const files = (await readdir(dir)).filter((f) => /^unit-\d+\.json$/.test(f)).sort();

let md = "# TAUGHT — running inventory of taught content\n\n";
md += "GENERATED FILE — do not edit. Regenerate with `node scripts/inventory.mjs` after compiling any unit.\n";
md += "Purpose: check before authoring that a word / grammar point / cognate is new (or deliberately revisited).\n\n";

const allWords = []; // { word, en, unit, lesson }

for (const f of files) {
	const u = JSON.parse(await readFile(`${dir}/${f}`, "utf8"));
	md += `## Unit ${u.n} — ${u.titleAr} · ${u.title}\n\n`;
	for (const lesson of u.lessons) {
		const vocab = [];
		const grammar = [];
		const cognates = [];
		for (const b of lesson.blocks) {
			if (b.type === "vocab")
				for (const i of b.items) {
					vocab.push(i);
					allWords.push({ word: i.arPlain, en: i.en, unit: u.n, lesson: lesson.n });
					if (i.cognate) cognates.push(`${i.arPlain} ↔ ${i.cognate.he} (${i.cognate.kind})`);
				}
			if (b.type === "grammar") for (const p of b.points) grammar.push(p.ar);
			if (b.type === "cognates")
				for (const c of b.items) {
					const entry = `${c.ar} ↔ ${c.he} (${c.kind})`;
					if (!cognates.some((x) => x.split(" ↔ ")[1] === `${c.he} (${c.kind})`)) cognates.push(entry);
				}
		}
		md += `### U${u.n} L${lesson.n} — ${lesson.titleAr} · ${lesson.title}\n`;
		if (vocab.length) md += `- **Vocab:** ${vocab.map((v) => `${v.arPlain} (${v.en})`).join(" · ")}\n`;
		if (grammar.length) md += `- **Grammar:** ${grammar.join(" · ")}\n`;
		if (cognates.length) md += `- **Cognates:** ${cognates.join(" · ")}\n`;
		md += "\n";
	}
}

md += "## Flat word index (alphabetical by Arabic)\n\n";
allWords.sort((a, b) => a.word.localeCompare(b.word, "ar"));
for (const w of allWords) md += `- ${w.word} — ${w.en} — U${w.unit} L${w.lesson}\n`;

await writeFile("content-src/TAUGHT.md", md, "utf8");
console.log(`OK TAUGHT.md: ${files.length} units, ${allWords.length} vocab items`);

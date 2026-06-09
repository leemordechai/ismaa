#!/usr/bin/env node
// Gemini TTS -> WAV (no npm deps, Node 18+).
//
// Single file:
//   node scripts/tts.mjs --text "مرحبا" --out static/audio/hi.wav [--voice Sulafat]
//        [--style "Read in Palestinian Levantine dialect:"] [--model gemini-2.5-flash-preview-tts]
//        [--speakers "Rana=Sulafat,Karim=Algieba"]   (multi-speaker; text lines must be "Rana: ...")
// Batch (avoids shell encoding issues with Arabic; recommended):
//   node scripts/tts.mjs --jobs scripts/tts-samples.json [--delay 10000]
//   jobs file: [{ "text", "out", "voice"?, "style"?, "speakers"?, "model"? }, ...]
//
// Auth: reads GEMINI_API_KEY from the environment (sent as x-goog-api-key header, never logged).
// Output: Gemini TTS returns base64 16-bit mono PCM @ 24 kHz; we wrap it in a 44-byte RIFF/WAV header.

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";

const DEFAULT_MODEL = "gemini-2.5-flash-preview-tts";
const DEFAULT_VOICE = "Sulafat"; // warm female

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

function wavFromPcm(pcm, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);          // fmt chunk size
  header.writeUInt16LE(1, 20);           // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * blockAlign, 28); // byte rate
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function buildSpeechConfig({ voice, speakers }) {
  if (speakers) {
    return {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: speakers.split(",").map((pair) => {
          const [speaker, voiceName] = pair.split("=").map((s) => s.trim());
          return { speaker, voiceConfig: { prebuiltVoiceConfig: { voiceName } } };
        }),
      },
    };
  }
  return { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || DEFAULT_VOICE } } };
}

async function generateTts({ text, style, voice, speakers, model }, apiKey) {
  const body = {
    contents: [{ parts: [{ text: style ? `${style}\n\n${text}` : text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: buildSpeechConfig({ voice, speakers }),
    },
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || DEFAULT_MODEL}:generateContent`;

  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const json = await res.json();
      const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      if (!part) throw new Error(`No audio in response: ${JSON.stringify(json).slice(0, 500)}`);
      const rate = /rate=(\d+)/.exec(part.inlineData.mimeType ?? "")?.[1];
      return { pcm: Buffer.from(part.inlineData.data, "base64"), sampleRate: rate ? Number(rate) : 24000 };
    }
    lastErr = new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
    if (res.status === 429 || res.status >= 500) {
      // 429 = rate limit (free tier is low-RPM): back off hard. 5xx: brief retry.
      await new Promise((r) => setTimeout(r, res.status === 429 ? attempt * 20000 : attempt * 4000));
      continue;
    }
    throw lastErr;
  }
  throw lastErr;
}

async function runJob(job, apiKey) {
  const { pcm, sampleRate } = await generateTts(job, apiKey);
  await mkdir(dirname(job.out) || ".", { recursive: true });
  await writeFile(job.out, wavFromPcm(pcm, sampleRate));
  const secs = pcm.length / (sampleRate * 2);
  console.log(`Wrote ${job.out} (${secs.toFixed(1)}s @ ${sampleRate} Hz, voice=${job.speakers || job.voice || DEFAULT_VOICE}, model=${job.model || DEFAULT_MODEL})`);
}

const args = parseArgs(process.argv);
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

if (args.jobs) {
  const raw = await readFile(args.jobs, "utf8");
  const jobs = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw); // tolerate UTF-8 BOM
  const delay = Number(args.delay ?? 10000);
  let failed = 0;
  for (let i = 0; i < jobs.length; i++) {
    try {
      await runJob(jobs[i], apiKey);
    } catch (err) {
      failed++;
      console.error(`FAILED ${jobs[i].out}: ${err.message}`);
    }
    if (i < jobs.length - 1) await new Promise((r) => setTimeout(r, delay));
  }
  process.exit(failed ? 1 : 0);
} else if (args.text && args.out) {
  await runJob(args, apiKey);
} else {
  console.error('Usage: node scripts/tts.mjs --text "..." --out file.wav [--voice NAME] [--style "..."] [--speakers "A=Voice1,B=Voice2"] [--model MODEL] | --jobs jobs.json [--delay ms]');
  process.exit(1);
}

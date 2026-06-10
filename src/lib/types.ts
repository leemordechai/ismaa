export type Register = 'street' | 'news' | 'shared';
export type CognateKind = 'true' | 'shifted' | 'false-friend' | 'loan';

export interface CognateNote {
	kind: CognateKind;
	he: string;
	note: string;
}

export interface VocabItem {
	id: string;
	ar: string; // vowelized headword
	arPlain: string;
	en: string;
	he: string;
	root?: string;
	pos: 'verb' | 'noun' | 'adj' | 'adv' | 'particle' | 'phrase';
	register: Register;
	cognate?: CognateNote;
	example: { ar: string; en: string };
	audio?: string; // path under /audio, tts-generated paths start with audio/tts/
	audioEx?: string; // example-sentence audio
	note?: string;
}

export interface DialogueLine {
	speaker: string;
	ar: string;
	en: string;
	audio?: string; // per-line audio
}

export interface QuizQuestion {
	prompt: string;
	promptAr?: string;
	audio?: string;
	options: string[];
	answer: number; // index
	why?: string;
}

export interface ClozeItem {
	ar: string; // contains ____
	en: string;
	options: string[];
	answer: number;
	audio?: string; // the completed sentence, revealed after answering
}

export interface CognateEntry {
	ar: string;
	he: string;
	kind: CognateKind;
	story: string;
}

export interface GrammarPoint {
	ar: string;
	explanation: string;
	examples: { ar: string; en: string; audio?: string }[];
}

export type Block =
	| { type: 'intro'; body: string }
	| { type: 'vocab'; title: string; items: VocabItem[] }
	| {
			type: 'dialogue';
			title: string;
			titleAr: string;
			situation: string;
			lines: DialogueLine[];
			audio?: string;
			// TTS metadata: maps Arabic speaker names to Latin labels + Gemini voices
			ttsVoices?: Record<string, { label: string; voice: string }>;
	  }
	| {
			type: 'listen';
			title: string;
			titleAr: string;
			brief: string;
			audio?: string;
			ttsVoice?: string;
			youtubeId?: string;
			preQuestions: string[];
			transcript: DialogueLine[];
			questions: QuizQuestion[];
	  }
	| { type: 'grammar'; title: string; points: GrammarPoint[] }
	| { type: 'quiz'; title: string; questions: QuizQuestion[] }
	| { type: 'cloze'; title: string; items: ClozeItem[] }
	| { type: 'cognates'; title: string; items: CognateEntry[] };

export interface Lesson {
	n: number;
	title: string;
	titleAr: string;
	canDo: string;
	status: 'ready' | 'planned';
	weight?: 'normal' | 'heavy';
	blocks: Block[];
}

export interface Unit {
	id: string;
	n: number;
	arc: number;
	title: string;
	titleAr: string;
	mission: string;
	cover?: string;
	registerMix: { street: number; news: number; shared: number };
	sources: string[];
	lessons: Lesson[];
}

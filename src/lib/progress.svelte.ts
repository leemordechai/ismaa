import { newCard, rate, dueCards, type CardState } from './srs';

export type AudioVerdict = 'pending' | 'tts-ok' | 'text-only';

interface Stored {
	lessonsDone: Record<string, true>;
	cards: Record<string, CardState>;
	audioVerdict: AudioVerdict;
	lastStudied: number | null;
	slowAudio?: boolean;
}

const KEY = 'ismaa-progress-v1';
const browser = typeof localStorage !== 'undefined';

function load(): Stored {
	if (browser) {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) return JSON.parse(raw);
		} catch {
			// corrupted storage: start fresh rather than crash
		}
	}
	return { lessonsDone: {}, cards: {}, audioVerdict: 'pending', lastStudied: null };
}

class Progress {
	lessonsDone = $state<Record<string, true>>({});
	cards = $state<Record<string, CardState>>({});
	audioVerdict = $state<AudioVerdict>('pending');
	lastStudied = $state<number | null>(null);
	slowAudio = $state(false);

	constructor() {
		const s = load();
		this.lessonsDone = s.lessonsDone;
		this.cards = s.cards;
		this.audioVerdict = s.audioVerdict;
		this.lastStudied = s.lastStudied;
		this.slowAudio = s.slowAudio ?? false;
	}

	private save() {
		if (!browser) return;
		const s: Stored = {
			lessonsDone: this.lessonsDone,
			cards: this.cards,
			audioVerdict: this.audioVerdict,
			lastStudied: this.lastStudied,
			slowAudio: this.slowAudio
		};
		localStorage.setItem(KEY, JSON.stringify(s));
	}

	toggleSlowAudio() {
		this.slowAudio = !this.slowAudio;
		this.save();
	}

	lessonKey(unitId: string, n: number) {
		return `${unitId}/${n}`;
	}

	completeLesson(unitId: string, n: number, vocabIds: string[]) {
		this.lessonsDone[this.lessonKey(unitId, n)] = true;
		const now = Date.now();
		for (const id of vocabIds) {
			if (!this.cards[id]) this.cards[id] = newCard(id, now);
		}
		this.lastStudied = now;
		this.save();
	}

	isLessonDone(unitId: string, n: number) {
		return !!this.lessonsDone[this.lessonKey(unitId, n)];
	}

	rateCard(id: string, grade: 0 | 1 | 2) {
		const c = this.cards[id];
		if (!c) return;
		this.cards[id] = rate(c, grade, Date.now());
		this.lastStudied = Date.now();
		this.save();
	}

	due(): CardState[] {
		return dueCards(this.cards, Date.now());
	}

	setAudioVerdict(v: AudioVerdict) {
		this.audioVerdict = v;
		this.save();
	}

	unitProgress(unitId: string, lessonCount: number): number {
		let done = 0;
		for (let i = 1; i <= lessonCount; i++) if (this.isLessonDone(unitId, i)) done++;
		return done;
	}
}

export const progress = new Progress();

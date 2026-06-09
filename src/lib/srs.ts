// SM-2-derived scheduler, simplified. Intervals in days; due as epoch ms.
// Grades: 0 = again, 1 = good, 2 = easy.

export interface CardState {
	id: string;
	due: number;
	interval: number; // days
	ease: number;
	reps: number;
	lapses: number;
}

const DAY = 24 * 60 * 60 * 1000;
const AGAIN_DELAY = 10 * 60 * 1000; // 10 minutes

export function newCard(id: string, now: number): CardState {
	return { id, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
}

export function rate(card: CardState, grade: 0 | 1 | 2, now: number): CardState {
	const c = { ...card };
	if (grade === 0) {
		c.lapses += 1;
		c.reps = 0;
		c.interval = 0;
		c.ease = Math.max(1.3, c.ease - 0.2);
		c.due = now + AGAIN_DELAY;
		return c;
	}
	c.reps += 1;
	if (c.reps === 1) {
		c.interval = 1;
	} else if (c.reps === 2) {
		c.interval = grade === 2 ? 4 : 3;
	} else {
		c.interval = Math.round(c.interval * c.ease * (grade === 2 ? 1.3 : 1));
	}
	if (grade === 2) c.ease = Math.min(3.0, c.ease + 0.1);
	c.due = now + c.interval * DAY;
	return c;
}

export function dueCards(cards: Record<string, CardState>, now: number): CardState[] {
	return Object.values(cards)
		.filter((c) => c.due <= now)
		.sort((a, b) => a.due - b.due);
}

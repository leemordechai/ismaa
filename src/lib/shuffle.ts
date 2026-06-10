// Fisher-Yates, non-mutating.
export function shuffle<T>(arr: readonly T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// Shuffled index permutation [0..n) — for randomizing answer order while
// keeping correctness checks against the original index.
export function permutation(n: number): number[] {
	return shuffle(Array.from({ length: n }, (_, i) => i));
}

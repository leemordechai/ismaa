<script lang="ts">
	import { onMount } from 'svelte';
	import type { QuizQuestion } from '$lib/types';
	import { permutation } from '$lib/shuffle';
	import AudioButton from './AudioButton.svelte';

	let { questions }: { questions: QuizQuestion[] } = $props();

	// picked stores the ORIGINAL option index; display order is a per-question
	// permutation, randomized on the client after mount (prerender-safe).
	let picked = $state<Record<number, number>>({});
	let order = $state<number[][]>([]);

	onMount(() => {
		order = questions.map((q) => permutation(q.options.length));
	});

	function displayOrder(qi: number, q: QuizQuestion): number[] {
		return order[qi] ?? q.options.map((_, i) => i);
	}

	function isArabic(s: string) {
		return /[؀-ۿ]/.test(s);
	}
</script>

<div class="space-y-7">
	{#each questions as q, qi}
		<div>
			<div class="flex items-start gap-3">
				<span class="text-ink-faint font-display mt-0.5 text-sm">{qi + 1}</span>
				<div class="min-w-0">
					<p class="font-medium">{q.prompt}</p>
					{#if q.promptAr}
						<p class="ar-text mt-1 text-xl" dir="rtl">{q.promptAr}</p>
					{/if}
				</div>
				{#if q.audio}
					<AudioButton src={q.audio} size="sm" />
				{/if}
			</div>
			<div class="mt-3 grid gap-2 sm:grid-cols-2">
				{#each displayOrder(qi, q) as oi (oi)}
					{@const opt = q.options[oi]}
					{@const answered = picked[qi] !== undefined}
					{@const state = !answered
						? 'idle'
						: oi === q.answer
							? 'correct'
							: picked[qi] === oi
								? 'wrong'
								: 'dim'}
					<button
						type="button"
						disabled={answered}
						onclick={() => (picked[qi] = oi)}
						dir={isArabic(opt) ? 'rtl' : 'ltr'}
						class="rounded-lg border px-4 py-2.5 text-start transition-all duration-200 {isArabic(opt) ? 'font-ar text-lg' : 'text-sm'}
						{state === 'idle'
							? 'border-line hover:border-olive hover:bg-olive-wash/50 cursor-pointer active:scale-[0.98]'
							: state === 'correct'
								? 'border-olive bg-olive-wash text-olive-deep'
								: state === 'wrong'
									? 'border-clay bg-clay-wash text-clay-deep'
									: 'border-line opacity-40'}"
					>
						{opt}
					</button>
				{/each}
			</div>
			{#if picked[qi] !== undefined && q.why}
				<p class="text-ink-soft mt-2 text-sm">
					<span class="text-olive-deep font-medium">{picked[qi] === q.answer ? '✓' : '✗'}</span>
					{q.why}
				</p>
			{/if}
		</div>
	{/each}
</div>

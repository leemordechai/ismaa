<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import type { MatchPair } from '$lib/types';
	import { permutation } from '$lib/shuffle';
	import { progress } from '$lib/progress.svelte';

	let { pairs }: { pairs: MatchPair[] } = $props();

	// Both columns shuffle independently; indices refer to the original pairs array.
	let arOrder = $state<number[]>([]);
	let enOrder = $state<number[]>([]);
	let selAr = $state<number | null>(null);
	let selEn = $state<number | null>(null);
	let matched = $state<Record<number, true>>({});
	let wrongFlash = $state<{ ar: number; en: number } | null>(null);

	onMount(() => {
		arOrder = permutation(pairs.length);
		enOrder = permutation(pairs.length);
	});

	const doneCount = $derived(Object.keys(matched).length);

	function playAr(i: number) {
		const src = pairs[i].audio;
		if (!src) return;
		if (progress.audioVerdict === 'text-only' && src.startsWith('audio/tts/')) return;
		const audio = new Audio(`${base}/${src}`);
		audio.playbackRate = progress.slowAudio ? 0.8 : 1;
		audio.preservesPitch = true;
		audio.play().catch(() => {});
	}

	function pickAr(i: number) {
		if (matched[i]) return;
		playAr(i);
		selAr = selAr === i ? null : i;
		check();
	}

	function pickEn(i: number) {
		if (matched[i]) return;
		selEn = selEn === i ? null : i;
		check();
	}

	function check() {
		if (selAr === null || selEn === null) return;
		if (selAr === selEn) {
			matched[selAr] = true;
		} else {
			wrongFlash = { ar: selAr, en: selEn };
			setTimeout(() => (wrongFlash = null), 450);
		}
		selAr = null;
		selEn = null;
	}
</script>

<p class="text-ink-soft mb-4 text-sm">
	Tap a word, tap its meaning. Arabic plays when tapped — match by ear first, eyes second.
	<span class="text-olive-deep ms-2 font-medium tabular-nums">{doneCount}/{pairs.length}</span>
</p>

<div class="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-8">
	<div class="space-y-2">
		{#each enOrder.length ? enOrder : pairs.map((_, i) => i) as i (i)}
			<button
				type="button"
				disabled={!!matched[i]}
				onclick={() => pickEn(i)}
				class="w-full rounded-lg border px-3 py-2.5 text-start text-sm transition-all duration-200
				{matched[i]
					? 'border-olive/40 bg-olive-wash/60 text-olive-deep opacity-70'
					: wrongFlash?.en === i
						? 'border-clay bg-clay-wash'
						: selEn === i
							? 'border-ink bg-paper-deep'
							: 'border-line hover:border-ink-soft cursor-pointer active:scale-[0.98]'}"
			>
				{pairs[i].en}
			</button>
		{/each}
	</div>
	<div class="space-y-2">
		{#each arOrder.length ? arOrder : pairs.map((_, i) => i) as i (i)}
			<button
				type="button"
				disabled={!!matched[i]}
				onclick={() => pickAr(i)}
				dir="rtl"
				class="font-ar w-full rounded-lg border px-3 py-2 text-start text-xl transition-all duration-200
				{matched[i]
					? 'border-olive/40 bg-olive-wash/60 text-olive-deep opacity-70'
					: wrongFlash?.ar === i
						? 'border-clay bg-clay-wash'
						: selAr === i
							? 'border-ink bg-paper-deep'
							: 'border-line hover:border-olive cursor-pointer active:scale-[0.98]'}"
			>
				{pairs[i].ar}
			</button>
		{/each}
	</div>
</div>

{#if doneCount === pairs.length && pairs.length > 0}
	<p class="text-olive-deep mt-4 text-sm font-medium">كله مزبوط — all matched.</p>
{/if}

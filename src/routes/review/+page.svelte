<script lang="ts">
	import { base } from '$app/paths';
	import { progress } from '$lib/progress.svelte';
	import { allVocab } from '$lib/content';
	import AudioButton from '$lib/components/AudioButton.svelte';

	// Snapshot the queue at page entry; grading advances through it.
	let queue = $state<string[]>([]);
	let i = $state(0);
	let show = $state(false);
	let loaded = $state(false);

	$effect(() => {
		if (!loaded) {
			queue = progress.due().map((c) => c.id);
			loaded = true;
		}
	});

	const current = $derived(i < queue.length ? allVocab[queue[i]] : null);
	const totalCards = $derived(Object.keys(progress.cards).length);

	const nextDue = $derived.by(() => {
		const all = Object.values(progress.cards);
		if (!all.length) return null;
		const t = Math.min(...all.map((c) => c.due));
		return new Date(t);
	});

	function grade(g: 0 | 1 | 2) {
		progress.rateCard(queue[i], g);
		show = false;
		i++;
	}
</script>

<svelte:head>
	<title>Review — Ismaʿ</title>
</svelte:head>

<header class="flex items-baseline justify-between py-10">
	<h1 class="font-display text-3xl tracking-tight">Review</h1>
	{#if loaded && queue.length > 0 && i < queue.length}
		<p class="text-ink-faint text-sm tabular-nums">{i + 1} / {queue.length}</p>
	{/if}
</header>

{#if !loaded}
	<p class="text-ink-soft">…</p>
{:else if totalCards === 0}
	<div class="border-line rounded-xl border border-dashed p-10 text-center">
		<p class="font-ar text-4xl" dir="rtl">لسا ما في إشي</p>
		<p class="text-ink-soft mt-3">Nothing in the queue yet — finish a lesson and its words land here.</p>
		<a
			href="{base}/unit/unit-01/"
			class="bg-olive-deep text-paper hover:bg-olive mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-medium transition-all active:scale-[0.98]"
		>
			Go to Unit 1 →
		</a>
	</div>
{:else if queue.length === 0 || i >= queue.length}
	<div class="border-line rounded-xl border border-dashed p-10 text-center">
		<p class="font-ar text-4xl" dir="rtl">{queue.length === 0 ? 'كل إشي تمام' : 'خلصنا!'}</p>
		<p class="text-ink-soft mt-3">
			{queue.length === 0 ? 'Queue is clear.' : `Done — ${queue.length} cards reviewed.`}
			{#if nextDue}
				Next card due {nextDue.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}.
			{/if}
		</p>
	</div>
{:else if current}
	<div class="border-line mx-auto max-w-xl rounded-2xl border p-8 shadow-[0_16px_48px_-24px_rgba(33,29,24,0.3)] sm:p-10">
		<div class="flex items-start justify-between gap-4">
			<span class="text-ink-faint text-[10px] tracking-widest uppercase">{current.pos} · {current.register}</span>
			{#if current.audio}
				<AudioButton src={current.audio} size="md" label="Hear it" />
			{/if}
		</div>
		<p class="font-ar mt-6 text-center text-6xl leading-snug" dir="rtl">{current.ar}</p>

		{#if show}
			<div class="border-line mt-8 border-t pt-6 text-center">
				<p class="text-xl font-medium">{current.en}</p>
				<p class="font-he text-ink-soft mt-1 text-lg" dir="rtl">{current.he}</p>
				<p class="ar-text mt-4 text-xl" dir="rtl">{current.example.ar}</p>
				<p class="text-ink-soft mt-1 text-sm">{current.example.en}</p>
			</div>
			<div class="mt-8 grid grid-cols-3 gap-3">
				<button
					type="button"
					onclick={() => grade(0)}
					class="border-clay text-clay-deep hover:bg-clay-wash cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97]"
				>
					Again<span class="text-ink-faint block text-[10px]">10 min</span>
				</button>
				<button
					type="button"
					onclick={() => grade(1)}
					class="border-line hover:border-ink-soft cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97]"
				>
					Good<span class="text-ink-faint block text-[10px]">spaced</span>
				</button>
				<button
					type="button"
					onclick={() => grade(2)}
					class="border-olive text-olive-deep hover:bg-olive-wash cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97]"
				>
					Easy<span class="text-ink-faint block text-[10px]">longer</span>
				</button>
			</div>
		{:else}
			<button
				type="button"
				onclick={() => (show = true)}
				class="bg-ink text-paper mx-auto mt-8 block cursor-pointer rounded-full px-8 py-3 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
			>
				Show answer
			</button>
		{/if}
	</div>
{/if}

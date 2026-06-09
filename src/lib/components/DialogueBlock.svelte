<script lang="ts">
	import type { DialogueLine } from '$lib/types';
	import AudioButton from './AudioButton.svelte';

	let {
		situation,
		lines,
		audio
	}: { situation: string; lines: DialogueLine[]; audio?: string } = $props();

	let showAll = $state(false);
	let revealed = $state<Record<number, boolean>>({});

	const speakers = $derived([...new Set(lines.map((l) => l.speaker))]);
</script>

<p class="text-ink-soft max-w-[60ch] italic">{situation}</p>

<div class="mt-4 flex flex-wrap items-center gap-4">
	{#if audio}
		<div class="flex items-center gap-3">
			<AudioButton src={audio} size="lg" label="Play the whole dialogue" />
			<span class="text-ink-soft text-sm">Listen first — eyes off the text.</span>
		</div>
	{/if}
	<button
		type="button"
		onclick={() => (showAll = !showAll)}
		class="border-line text-ink-soft hover:border-ink-soft ml-auto cursor-pointer rounded-full border px-3 py-1 text-xs tracking-wide uppercase transition-colors active:scale-[0.98]"
	>
		{showAll ? 'Hide translations' : 'Show all translations'}
	</button>
</div>

<div class="mt-5 space-y-1.5">
	{#each lines as line, i}
		<div
			class="group rounded-lg px-4 py-2.5 {line.speaker === speakers[0] ? 'bg-paper-deep/50' : 'bg-olive-wash/40'}"
		>
			<div class="flex items-center justify-between gap-3" dir="rtl">
				<span class="font-ar-ui text-ink-faint shrink-0 text-xs">{line.speaker}</span>
				<button
					type="button"
					class="text-ink-faint hover:text-ink-soft shrink-0 cursor-pointer text-[10px] tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100 {revealed[i] || showAll ? 'opacity-100' : ''}"
					onclick={() => (revealed[i] = !revealed[i])}
					dir="ltr">EN</button
				>
			</div>
			<p class="ar-text text-[1.35rem]" dir="rtl">{line.ar}</p>
			{#if showAll || revealed[i]}
				<p class="text-ink-soft mt-1 text-sm">{line.en}</p>
			{/if}
		</div>
	{/each}
</div>

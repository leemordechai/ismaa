<script lang="ts">
	import type { VocabItem } from '$lib/types';
	import AudioButton from './AudioButton.svelte';

	let { item }: { item: VocabItem } = $props();

	const registerStyle = $derived(
		{
			street: 'bg-olive-wash text-olive-deep',
			news: 'bg-clay-wash text-clay-deep',
			shared: 'bg-paper-deep text-ink-soft'
		}[item.register]
	);

	const registerLabel = $derived(
		{ street: 'street', news: 'news', shared: 'shared MSA' }[item.register]
	);

	const cognateStyle = $derived(
		item.cognate
			? {
					true: 'border-olive/50 bg-olive-wash/60',
					shifted: 'border-clay/40 bg-clay-wash/60',
					'false-friend': 'border-clay-deep/60 bg-clay-wash',
					loan: 'border-line bg-paper-deep/60'
				}[item.cognate.kind]
			: ''
	);

	const cognateLabel = $derived(
		item.cognate
			? {
					true: 'true bridge',
					shifted: 'shifted root',
					'false-friend': '⚠ false friend',
					loan: 'loaned into Hebrew'
				}[item.cognate.kind]
			: ''
	);
</script>

<div class="border-line grid grid-cols-1 gap-x-6 gap-y-3 border-b py-5 sm:grid-cols-[1fr_auto]">
	<div class="order-2 sm:order-1">
		<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
			<span class="text-lg font-medium">{item.en}</span>
			<span class="font-he text-ink-soft text-base" dir="rtl">{item.he}</span>
		</div>
		<div class="mt-1.5 flex flex-wrap items-center gap-2">
			<span class="rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase {registerStyle}">{registerLabel}</span>
			<span class="text-ink-faint text-[11px] tracking-wide uppercase">{item.pos}</span>
			{#if item.root}
				<span class="font-ar text-ink-faint text-sm" dir="rtl">{item.root}</span>
			{/if}
		</div>
		<div class="mt-3 flex items-start gap-2.5 leading-relaxed">
			{#if item.audioEx}
				<AudioButton src={item.audioEx} size="sm" label="Hear the example" />
			{/if}
			<p class="min-w-0">
				<span class="ar-text text-xl" dir="rtl">{item.example.ar}</span>
				<span class="text-ink-soft mt-0.5 block text-sm">{item.example.en}</span>
			</p>
		</div>
		{#if item.note}
			<p class="text-ink-soft mt-2 max-w-[58ch] text-sm leading-relaxed italic">{item.note}</p>
		{/if}
		{#if item.cognate}
			<div class="mt-3 rounded-md border px-3 py-2 {cognateStyle}">
				<span class="text-[11px] font-semibold tracking-wider uppercase">{cognateLabel}</span>
				<span class="font-he mx-2" dir="rtl">{item.cognate.he}</span>
				<span class="text-ink-soft block text-sm leading-relaxed">{item.cognate.note}</span>
			</div>
		{/if}
	</div>
	<div class="order-1 flex items-start justify-end gap-3 sm:order-2">
		{#if item.audio}
			<AudioButton src={item.audio} size="sm" label="Hear {item.arPlain}" />
		{/if}
		<span class="font-ar text-ink text-4xl leading-snug" dir="rtl">{item.ar}</span>
	</div>
</div>

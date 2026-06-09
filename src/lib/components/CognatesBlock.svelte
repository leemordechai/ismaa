<script lang="ts">
	import type { CognateEntry } from '$lib/types';

	let { items }: { items: CognateEntry[] } = $props();

	const kindMeta = {
		true: { label: 'True bridge', cls: 'bg-olive text-paper' },
		shifted: { label: 'Shifted root', cls: 'bg-clay text-paper' },
		'false-friend': { label: 'False friend', cls: 'bg-clay-deep text-paper' },
		loan: { label: 'Loanword', cls: 'bg-ink text-paper' }
	};
</script>

<div class="grid gap-4 md:grid-cols-2">
	{#each items as entry}
		<div class="border-line rounded-xl border p-5 {items.length === 1 ? 'md:col-span-2' : ''}">
			<span class="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase {kindMeta[entry.kind].cls}">
				{kindMeta[entry.kind].label}
			</span>
			<div class="mt-4 flex items-center justify-center gap-4 text-center">
				<span class="font-ar text-3xl" dir="rtl">{entry.ar}</span>
				<span class="text-ink-faint text-xl">↔</span>
				<span class="font-he text-2xl" dir="rtl">{entry.he}</span>
			</div>
			<p class="text-ink-soft mt-4 text-sm leading-relaxed">{entry.story}</p>
		</div>
	{/each}
</div>

<script lang="ts">
	import type { ClozeItem } from '$lib/types';

	let { items }: { items: ClozeItem[] } = $props();

	let picked = $state<Record<number, number>>({});
</script>

<div class="space-y-6">
	{#each items as item, i}
		{@const answered = picked[i] !== undefined}
		{@const correct = answered && picked[i] === item.answer}
		{@const parts = item.ar.split('____')}
		<div class="border-line rounded-lg border p-4">
			<p class="ar-text text-2xl" dir="rtl">
				{parts[0]}<span
					class="mx-1 inline-block min-w-16 border-b-2 text-center {answered
						? correct
							? 'border-olive text-olive-deep'
							: 'border-clay text-clay-deep'
						: 'border-ink-faint text-transparent'}"
					>{answered ? item.options[item.answer] : '——'}</span
				>{parts[1] ?? ''}
			</p>
			{#if answered}
				<p class="text-ink-soft mt-1.5 text-sm">{item.en}</p>
			{/if}
			<div class="mt-3 flex flex-wrap gap-2" dir="rtl">
				{#each item.options as opt, oi}
					<button
						type="button"
						disabled={answered}
						onclick={() => (picked[i] = oi)}
						class="font-ar rounded-full border px-4 py-1.5 text-lg transition-all duration-200
						{!answered
							? 'border-line hover:border-olive hover:bg-olive-wash cursor-pointer active:scale-[0.96]'
							: oi === item.answer
								? 'border-olive bg-olive-wash text-olive-deep'
								: picked[i] === oi
									? 'border-clay bg-clay-wash text-clay-deep line-through'
									: 'border-line opacity-40'}"
					>
						{opt}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

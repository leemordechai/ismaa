<script lang="ts">
	import type { GrammarPoint } from '$lib/types';

	let { points }: { points: GrammarPoint[] } = $props();
</script>

<div class="space-y-8">
	{#each points as point}
		<div class="grid gap-5 md:grid-cols-[1fr_1.2fr]">
			<div>
				<p class="font-ar text-2xl leading-relaxed font-bold" dir="rtl">{point.ar}</p>
				<p class="text-ink-soft mt-2 max-w-[48ch] text-sm leading-relaxed">{point.explanation}</p>
			</div>
			<div class="border-line space-y-3 border-s ps-5">
				{#each point.examples as ex}
					<div>
						<p class="ar-text text-xl" dir="rtl">{ex.ar}</p>
						<p class="text-ink-soft text-sm">{ex.en}</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

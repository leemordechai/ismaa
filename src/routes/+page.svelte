<script lang="ts">
	import { base } from '$app/paths';
	import { arcs, units } from '$lib/content/trajectory';
	import { contentUnits } from '$lib/content';
	import { progress } from '$lib/progress.svelte';
	import { inview } from '$lib/inview';

	const arcNumerals = ['٠١', '٠٢', '٠٣', '٠٤', '٠٥'];

	// Next lesson to continue with: first not-done ready lesson of the first open unit.
	const next = $derived.by(() => {
		for (const meta of units) {
			if (meta.status !== 'ready') continue;
			const unit = contentUnits[meta.id];
			if (!unit) continue;
			for (const lesson of unit.lessons) {
				if (lesson.status === 'ready' && !progress.isLessonDone(unit.id, lesson.n)) {
					return { unit: meta, lesson };
				}
			}
		}
		return null;
	});

	const dueCount = $derived(progress.due().length);
	const started = $derived(Object.keys(progress.lessonsDone).length > 0);
</script>

<svelte:head>
	<title>Ismaʿ — Palestinian Arabic by ear</title>
	<meta
		name="description"
		content="A listening-first path from A2 to hearing Palestinian street talk, news, and testimony directly."
	/>
</svelte:head>

<!-- Hero -->
<section class="grid items-end gap-x-10 gap-y-8 py-14 md:grid-cols-[1.1fr_auto] md:py-24">
	<div>
		<p class="text-ink-faint text-xs font-medium tracking-[0.28em] uppercase">
			A2 → B1 · listening-first · twenty units
		</p>
		<h1 class="font-display mt-4 text-5xl leading-[1.02] font-medium tracking-tight md:text-6xl">
			Palestinian Arabic,<br />by ear.
		</h1>
		<p class="text-ink-soft mt-5 max-w-[52ch] leading-relaxed">
			From several hundred words to hearing the street, the news, and Gaza speak for themselves —
			fifteen minutes a day, no transliteration, no filler.
		</p>
		<div class="mt-8 flex flex-wrap items-center gap-3">
			{#if next}
				<a
					href="{base}/unit/{next.unit.id}/lesson/{next.lesson.n}/"
					class="bg-olive-deep text-paper hover:bg-olive inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-[0_4px_16px_-4px_rgba(92,107,60,0.5)] transition-all active:scale-[0.98]"
				>
					{started ? 'Continue' : 'Begin'} — Lesson {next.lesson.n}: {next.lesson.title}
				</a>
			{:else}
				<span class="border-line rounded-full border px-5 py-2.5 text-sm">
					Unit 1 complete — Unit 2 is being authored. Keep the review queue warm.
				</span>
			{/if}
			<a
				href="{base}/review/"
				class="border-line hover:border-ink-soft rounded-full border px-5 py-2.5 text-sm transition-colors active:scale-[0.98]"
			>
				Review {dueCount > 0 ? `· ${dueCount} due` : ''}
			</a>
		</div>
		{#if progress.audioVerdict === 'pending'}
			<a
				href="{base}/audio-lab/"
				class="border-clay/40 bg-clay-wash/60 text-clay-deep mt-4 inline-block rounded-lg border px-4 py-2.5 text-sm transition-colors hover:border-clay"
			>
				<span class="font-semibold">First task:</span> five voice samples await your verdict in the
				Audio Lab →
			</a>
		{/if}
	</div>
	<div class="hidden text-end md:block">
		<p class="font-ar text-ink text-[7rem] leading-[1.3] whitespace-nowrap" dir="rtl">اِسْمَع</p>
		<p class="text-ink-faint border-line mt-1 border-t pt-2 text-xs tracking-wider">
			ismaʿ — <span class="italic">listen!</span> (imperative)
		</p>
	</div>
</section>

<!-- Trajectory -->
<section class="border-line border-t pt-10">
	<div class="flex items-baseline justify-between">
		<h2 class="font-display text-2xl tracking-tight">The path</h2>
		<p class="text-ink-faint text-xs tracking-wider uppercase">~10 months · 2 weeks per unit</p>
	</div>

	<div class="mt-8 space-y-14">
		{#each arcs as arc}
			<div class="reveal grid gap-x-10 gap-y-5 md:grid-cols-[180px_1fr]" use:inview>
				<div>
					<p class="font-ar text-ink-faint/60 text-5xl" dir="rtl">{arcNumerals[arc.n - 1]}</p>
					<p class="font-ar mt-2 text-3xl" dir="rtl">{arc.titleAr}</p>
					<p class="font-display mt-1 text-lg">{arc.title}</p>
					<p class="text-ink-soft mt-2 text-sm leading-relaxed">{arc.mission}</p>
				</div>
				<ul class="border-line divide-line divide-y border-y">
					{#each units.filter((u) => u.arc === arc.n) as u}
						{@const unit = contentUnits[u.id]}
						{@const lessonCount = unit?.lessons.length ?? 6}
						{@const done = unit ? progress.unitProgress(u.id, lessonCount) : 0}
						<li>
							{#if u.status === 'ready'}
								<a
									href="{base}/unit/{u.id}/"
									class="group hover:bg-olive-wash/40 -mx-3 flex items-center gap-4 rounded-md px-3 py-3.5 transition-colors"
								>
									<span class="text-ink-faint w-7 shrink-0 text-sm tabular-nums">{String(u.n).padStart(2, '0')}</span>
									<span class="font-ar w-40 shrink-0 text-xl" dir="rtl">{u.titleAr}</span>
									<span class="min-w-0">
										<span class="block font-medium">{u.title}</span>
										<span class="text-ink-soft block truncate text-sm">{u.focus}</span>
									</span>
									<span class="text-olive-deep ms-auto shrink-0 text-sm font-medium">
										{done > 0 ? `${done}/${lessonCount}` : 'start'}
										<span class="inline-block transition-transform group-hover:translate-x-0.5">→</span>
									</span>
								</a>
							{:else}
								<div class="-mx-3 flex items-center gap-4 px-3 py-3.5 opacity-50">
									<span class="text-ink-faint w-7 shrink-0 text-sm tabular-nums">{String(u.n).padStart(2, '0')}</span>
									<span class="font-ar w-40 shrink-0 text-xl" dir="rtl">{u.titleAr}</span>
									<span class="min-w-0">
										<span class="block font-medium">{u.title}</span>
										<span class="text-ink-soft block truncate text-sm">{u.focus}</span>
									</span>
									<span class="text-ink-faint ms-auto shrink-0 text-[10px] tracking-widest uppercase">planned</span>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<script lang="ts">
	import { base } from '$app/paths';
	import { progress } from '$lib/progress.svelte';

	let { data } = $props();
	const unit = $derived(data.unit);

	let coverMissing = $state(false);
</script>

<svelte:head>
	<title>Unit {unit.n} · {unit.title} — Ismaʿ</title>
</svelte:head>

<nav class="text-ink-faint pt-6 text-xs tracking-wider uppercase">
	<a href="{base}/" class="hover:text-ink-soft">The Path</a>
	<span class="mx-2">/</span>
	<span>Arc {unit.arc} · Unit {String(unit.n).padStart(2, '0')}</span>
</nav>

<header class="grid items-center gap-x-10 gap-y-6 py-10 md:grid-cols-[1.3fr_1fr]">
	<div>
		<p class="font-ar text-6xl leading-tight md:text-7xl" dir="rtl">{unit.titleAr}</p>
		<h1 class="font-display mt-2 text-3xl tracking-tight">{unit.title}</h1>
		<p class="text-ink-soft mt-4 max-w-[58ch] leading-relaxed">{unit.mission}</p>

		<div class="mt-6 max-w-md">
			<div class="border-line flex h-2.5 overflow-hidden rounded-full border">
				<div class="bg-olive" style="width:{unit.registerMix.street}%"></div>
				<div class="bg-clay" style="width:{unit.registerMix.news}%"></div>
				<div class="bg-ink-faint" style="width:{unit.registerMix.shared}%"></div>
			</div>
			<div class="text-ink-faint mt-1.5 flex gap-4 text-[11px] tracking-wide uppercase">
				{#if unit.registerMix.street}<span><span class="bg-olive me-1 inline-block h-2 w-2 rounded-full"></span>street {unit.registerMix.street}%</span>{/if}
				{#if unit.registerMix.news}<span><span class="bg-clay me-1 inline-block h-2 w-2 rounded-full"></span>news {unit.registerMix.news}%</span>{/if}
				{#if unit.registerMix.shared}<span><span class="bg-ink-faint me-1 inline-block h-2 w-2 rounded-full"></span>shared MSA {unit.registerMix.shared}%</span>{/if}
			</div>
		</div>
	</div>
	{#if unit.cover && !coverMissing}
		<img
			src="{base}/{unit.cover}"
			alt=""
			onerror={() => (coverMissing = true)}
			class="border-line aspect-[4/3] w-full rounded-xl border object-cover shadow-[0_12px_40px_-16px_rgba(33,29,24,0.35)]"
		/>
	{/if}
</header>

<ul class="border-line divide-line divide-y border-y">
	{#each unit.lessons as lesson}
		{@const done = progress.isLessonDone(unit.id, lesson.n)}
		<li>
			{#if lesson.status === 'ready'}
				<a
					href="{base}/unit/{unit.id}/lesson/{lesson.n}/"
					class="group hover:bg-olive-wash/40 -mx-3 flex items-start gap-5 rounded-md px-3 py-5 transition-colors"
				>
					<span
						class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm {done
							? 'bg-olive text-paper'
							: 'border-line text-ink-soft border'}"
					>
						{done ? '✓' : lesson.n}
					</span>
					<span class="min-w-0">
						<span class="flex flex-wrap items-baseline gap-x-3">
							<span class="font-ar text-2xl" dir="rtl">{lesson.titleAr}</span>
							<span class="font-medium">{lesson.title}</span>
							{#if lesson.weight === 'heavy'}
								<span class="text-clay-deep bg-clay-wash rounded-full px-2 py-0.5 text-[10px] tracking-wider uppercase">heavy content</span>
							{/if}
						</span>
						<span class="text-ink-soft mt-1 block max-w-[64ch] text-sm leading-relaxed">{lesson.canDo}</span>
					</span>
					<span class="text-olive-deep ms-auto mt-1 shrink-0 text-sm opacity-0 transition-opacity group-hover:opacity-100">open →</span>
				</a>
			{:else}
				<div class="-mx-3 flex items-start gap-5 px-3 py-5 opacity-50">
					<span class="border-line text-ink-soft mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm">{lesson.n}</span>
					<span class="min-w-0">
						<span class="flex flex-wrap items-baseline gap-x-3">
							<span class="font-ar text-2xl" dir="rtl">{lesson.titleAr}</span>
							<span class="font-medium">{lesson.title}</span>
						</span>
						<span class="text-ink-soft mt-1 block text-sm">{lesson.canDo}</span>
					</span>
					<span class="text-ink-faint ms-auto mt-1 shrink-0 text-[10px] tracking-widest uppercase">planned</span>
				</div>
			{/if}
		</li>
	{/each}
</ul>

<p class="text-ink-faint mt-8 max-w-[72ch] text-xs leading-relaxed">
	<span class="font-semibold tracking-wider uppercase">Sources & verification:</span>
	{#each unit.sources as s, i}{s}{i < unit.sources.length - 1 ? ' · ' : ''}{/each}
</p>

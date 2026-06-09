<script lang="ts">
	import { base } from '$app/paths';
	import { progress } from '$lib/progress.svelte';
	import VocabCard from '$lib/components/VocabCard.svelte';
	import DialogueBlock from '$lib/components/DialogueBlock.svelte';
	import ListenBlock from '$lib/components/ListenBlock.svelte';
	import QuizBlock from '$lib/components/QuizBlock.svelte';
	import ClozeBlock from '$lib/components/ClozeBlock.svelte';
	import GrammarBlock from '$lib/components/GrammarBlock.svelte';
	import CognatesBlock from '$lib/components/CognatesBlock.svelte';

	let { data } = $props();
	const unit = $derived(data.unit);
	const lesson = $derived(data.lesson);

	const done = $derived(progress.isLessonDone(unit.id, lesson.n));
	const nextLesson = $derived(
		unit.lessons.find((l) => l.n > lesson.n && l.status === 'ready') ?? null
	);

	const sectionLabel: Record<string, string> = {
		vocab: 'Vocabulary',
		dialogue: 'Dialogue',
		listen: 'Listening',
		grammar: 'Pattern',
		quiz: 'Check',
		cloze: 'Fill the gap',
		cognates: 'Hebrew bridges'
	};

	function complete() {
		progress.completeLesson(unit.id, lesson.n, data.vocabIds);
	}
</script>

<svelte:head>
	<title>{lesson.title} · Unit {unit.n} — Ismaʿ</title>
</svelte:head>

<nav class="text-ink-faint flex items-baseline justify-between pt-6 text-xs tracking-wider uppercase">
	<span>
		<a href="{base}/" class="hover:text-ink-soft">The Path</a>
		<span class="mx-2">/</span>
		<a href="{base}/unit/{unit.id}/" class="hover:text-ink-soft" dir="rtl">{unit.titleAr}</a>
	</span>
	<span>Lesson {lesson.n} of {unit.lessons.length}</span>
</nav>

<header class="border-line border-b py-9">
	<p class="font-ar text-5xl leading-tight" dir="rtl">{lesson.titleAr}</p>
	<h1 class="font-display mt-1.5 text-2xl tracking-tight">{lesson.title}</h1>
	{#if lesson.weight === 'heavy'}
		<p class="text-clay-deep bg-clay-wash mt-3 inline-block rounded-md px-3 py-1.5 text-sm">
			This lesson contains testimony about war. Take it at your own pace.
		</p>
	{/if}
	<p class="text-ink-soft mt-4 max-w-[60ch] text-sm leading-relaxed">
		<span class="text-olive-deep font-semibold tracking-wider uppercase">Can-do</span> — {lesson.canDo}
	</p>
</header>

<div class="space-y-14 pt-10">
	{#each lesson.blocks as block, bi}
		{#if block.type === 'intro'}
			<p class="text-ink max-w-[62ch] text-lg leading-relaxed font-light">{block.body}</p>
		{:else}
			<section>
				<div class="mb-5 flex items-baseline gap-3">
					<span class="text-ink-faint font-display text-sm tabular-nums">{String(bi).padStart(2, '0')}</span>
					<h2 class="text-xs font-semibold tracking-[0.2em] uppercase">
						{sectionLabel[block.type] ?? block.type}
					</h2>
					{#if 'title' in block && block.title && block.title !== sectionLabel[block.type]}
						<span class="text-ink-soft text-sm">— {block.title}</span>
					{/if}
				</div>

				{#if block.type === 'vocab'}
					<div>
						{#each block.items as item (item.id)}
							<VocabCard {item} />
						{/each}
					</div>
				{:else if block.type === 'dialogue'}
					<DialogueBlock situation={block.situation} lines={block.lines} audio={block.audio} />
				{:else if block.type === 'listen'}
					<ListenBlock
						brief={block.brief}
						audio={block.audio}
						youtubeId={block.youtubeId}
						preQuestions={block.preQuestions}
						transcript={block.transcript}
						questions={block.questions}
					/>
				{:else if block.type === 'grammar'}
					<GrammarBlock points={block.points} />
				{:else if block.type === 'quiz'}
					<QuizBlock questions={block.questions} />
				{:else if block.type === 'cloze'}
					<ClozeBlock items={block.items} />
				{:else if block.type === 'cognates'}
					<CognatesBlock items={block.items} />
				{/if}
			</section>
		{/if}
	{/each}
</div>

<div class="border-line mt-16 border-t pt-8">
	{#if done}
		<div class="flex flex-wrap items-center gap-4">
			<span class="bg-olive text-paper inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
				✓ Lesson complete — {data.vocabIds.length} words in your review queue
			</span>
			{#if nextLesson}
				<a
					href="{base}/unit/{unit.id}/lesson/{nextLesson.n}/"
					class="border-line hover:border-ink-soft rounded-full border px-5 py-2.5 text-sm transition-colors"
				>
					Next: {nextLesson.title} →
				</a>
			{:else}
				<a
					href="{base}/unit/{unit.id}/"
					class="border-line hover:border-ink-soft rounded-full border px-5 py-2.5 text-sm transition-colors"
				>
					Back to the unit →
				</a>
			{/if}
		</div>
	{:else}
		<button
			type="button"
			onclick={complete}
			class="bg-olive-deep text-paper hover:bg-olive cursor-pointer rounded-full px-7 py-3 text-sm font-medium shadow-[0_4px_16px_-4px_rgba(92,107,60,0.5)] transition-all active:scale-[0.98]"
		>
			Finish lesson — queue {data.vocabIds.length} words for review
		</button>
		<p class="text-ink-faint mt-2 text-xs">New words enter spaced repetition; they'll resurface tomorrow.</p>
	{/if}
</div>

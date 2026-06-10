<script lang="ts">
	import type { DialogueLine, QuizQuestion } from '$lib/types';
	import AudioButton from './AudioButton.svelte';
	import QuizBlock from './QuizBlock.svelte';

	let {
		brief,
		audio,
		youtubeId,
		preQuestions,
		transcript,
		questions
	}: {
		brief: string;
		audio?: string;
		youtubeId?: string;
		preQuestions: string[];
		transcript: DialogueLine[];
		questions: QuizQuestion[];
	} = $props();

	let showTranscript = $state(false);
	let showAll = $state(false);
	let revealed = $state<Record<number, boolean>>({});
</script>

<p class="text-ink-soft max-w-[60ch]">{brief}</p>

{#if preQuestions.length}
	<div class="border-olive/30 bg-olive-wash/40 mt-4 rounded-lg border px-4 py-3">
		<p class="text-olive-deep text-xs font-semibold tracking-wider uppercase">Listen for</p>
		<ul class="mt-1.5 space-y-1 text-sm">
			{#each preQuestions as pq}
				<li class="flex gap-2"><span class="text-olive">—</span><span>{pq}</span></li>
			{/each}
		</ul>
	</div>
{/if}

<div class="mt-5">
	{#if youtubeId}
		<div class="border-line aspect-video w-full overflow-hidden rounded-lg border">
			<iframe
				class="h-full w-full"
				src="https://www.youtube-nocookie.com/embed/{youtubeId}"
				title="Listening clip"
				frameborder="0"
				allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		<p class="text-ink-faint mt-1.5 text-xs">
			Embed not loading? <a
				class="underline hover:text-ink-soft"
				href="https://www.youtube.com/watch?v={youtubeId}"
				target="_blank"
				rel="noreferrer">Open on YouTube</a
			> — and use YouTube's own speed control (⚙ → 0.75×) for slow listening.
		</p>
	{:else if audio}
		<div class="border-line flex items-center gap-4 rounded-lg border p-4">
			<AudioButton src={audio} size="lg" label="Play the clip" />
			<p class="text-ink-soft text-sm">Play it twice with the text closed. Then check the transcript.</p>
		</div>
	{/if}
</div>

<div class="mt-5" hidden={!transcript.length}>
	<button
		type="button"
		onclick={() => (showTranscript = !showTranscript)}
		class="border-line hover:border-ink-soft cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors active:scale-[0.98]"
	>
		{showTranscript ? 'Hide transcript' : 'Show transcript'}
	</button>

	{#if showTranscript}
		<div class="border-line mt-4 rounded-lg border p-4">
			<div class="flex justify-end">
				<button
					type="button"
					onclick={() => (showAll = !showAll)}
					class="text-ink-faint hover:text-ink-soft cursor-pointer text-[11px] tracking-wider uppercase"
				>
					{showAll ? 'Hide translations' : 'Show all translations'}
				</button>
			</div>
			<div class="mt-2 space-y-3">
				{#each transcript as line, i}
					<div class="group">
						<p class="ar-text text-xl" dir="rtl">{line.ar}</p>
						{#if showAll || revealed[i]}
							<p class="text-ink-soft mt-0.5 text-sm">{line.en}</p>
						{:else}
							<button
								type="button"
								onclick={() => (revealed[i] = true)}
								class="text-ink-faint hover:text-ink-soft cursor-pointer text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-100"
								>show EN</button
							>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if questions.length}
	<div class="mt-7">
		<p class="text-ink-faint mb-4 text-xs font-semibold tracking-widest uppercase">After listening</p>
		<QuizBlock {questions} />
	</div>
{/if}

<script lang="ts">
	import { progress } from '$lib/progress.svelte';
	import AudioButton from '$lib/components/AudioButton.svelte';

	const samples = [
		{
			file: 'audio/tts-samples/sample-1-dialogue.wav',
			title: 'Dialogue — Gemini 2.5',
			tag: '2.5 Flash · Sulafat + Algieba',
			desc: 'Two-speaker casual exchange: «شو صار اليوم في الأخبار؟ والله ما سمعت إشي…» Listen for whether شو صار stays colloquial (“shu sar”) or drifts toward fuṣḥā.'
		},
		{
			file: 'audio/tts-samples/sample-1b-dialogue-gemini31.wav',
			title: 'Same dialogue — Gemini 3.1',
			tag: '3.1 Flash · same voices',
			desc: 'Identical text and voices on the newer model. The A/B that matters: does 3.1 sound more Palestinian? (It costs 2× — only worth it if you hear the difference.)'
		},
		{
			file: 'audio/tts-samples/sample-2-news.wav',
			title: 'News register',
			tag: '2.5 Flash · Charon',
			desc: 'Radio-anchor read: «آلاف المتظاهرين خرجوا اليوم في رام الله ضد الاحتلال.» News register is allowed to sound formal — judge it as radio, not street.'
		},
		{
			file: 'audio/tts-samples/sample-3-vocab.wav',
			title: 'Vocab card — female voice',
			tag: '2.5 Flash · Sulafat',
			desc: 'Single flashcard word, slow and clear: مُظاهَرة. This is what every vocab card would sound like.'
		},
		{
			file: 'audio/tts-samples/sample-3b-vocab-iapetus.wav',
			title: 'Vocab card — male voice',
			tag: '2.5 Flash · Iapetus',
			desc: 'Same word, male voice — pick the default flashcard voice you’d rather hear 1,000 times.'
		}
	];

	const verdict = $derived(progress.audioVerdict);
</script>

<svelte:head>
	<title>Audio Lab — Ismaʿ</title>
</svelte:head>

<header class="max-w-[68ch] py-10">
	<h1 class="font-display text-3xl tracking-tight">Audio Lab</h1>
	<p class="text-ink-soft mt-4 leading-relaxed">
		The rule you set: audio only if it sounds <em>real</em>. There is no free source of human-recorded
		Palestinian word audio (verified — see RESOURCES.md), so generated speech is the only way to put a
		voice on every word and dialogue. These five samples are the trial. Authentic clips in lessons are
		always real media regardless — this verdict only governs vocab cards and dialogues.
	</p>
	<p class="border-olive/30 bg-olive-wash/40 text-olive-deep mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed">
		Update after your feedback: every lesson audio file has been regenerated at a calmer, slower pace,
		and audio now covers example sentences, individual dialogue lines, grammar examples, and cloze
		answers. The <span class="font-semibold">1× / 0.8×</span> toggle in the header slows anything
		further, pitch preserved. (These five gate samples are kept at the original pace for comparison.)
	</p>
</header>

<div class="space-y-4">
	{#each samples as s, i}
		<div class="border-line flex items-center gap-5 rounded-xl border p-5">
			<AudioButton src={s.file} size="lg" label="Play {s.title}" />
			<div class="min-w-0">
				<div class="flex flex-wrap items-baseline gap-x-3">
					<span class="font-medium">{i + 1}. {s.title}</span>
					<span class="text-ink-faint text-[11px] tracking-wider uppercase">{s.tag}</span>
				</div>
				<p class="text-ink-soft mt-1 text-sm leading-relaxed">{s.desc}</p>
			</div>
		</div>
	{/each}
</div>

<div class="border-line mt-10 rounded-xl border p-6">
	<h2 class="text-xs font-semibold tracking-[0.2em] uppercase">Your verdict</h2>
	<p class="text-ink-soft mt-2 max-w-[60ch] text-sm leading-relaxed">
		<span class="font-medium">Real enough</span> keeps the play buttons on every vocab card and dialogue
		(Unit 1's audio is already generated). <span class="font-medium">Not real</span> removes generated
		audio everywhere — the app runs text + authentic clips only. Change your mind anytime.
	</p>
	<div class="mt-5 flex flex-wrap gap-3">
		<button
			type="button"
			onclick={() => progress.setAudioVerdict('tts-ok')}
			class="cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all active:scale-[0.98] {verdict === 'tts-ok'
				? 'bg-olive-deep text-paper'
				: 'border-olive text-olive-deep hover:bg-olive-wash border'}"
		>
			✓ Real enough — use the voices
		</button>
		<button
			type="button"
			onclick={() => progress.setAudioVerdict('text-only')}
			class="cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all active:scale-[0.98] {verdict === 'text-only'
				? 'bg-clay-deep text-paper'
				: 'border-clay text-clay-deep hover:bg-clay-wash border'}"
		>
			✗ Mechanical — text only
		</button>
		{#if verdict !== 'pending'}
			<button
				type="button"
				onclick={() => progress.setAudioVerdict('pending')}
				class="text-ink-faint hover:text-ink-soft cursor-pointer px-3 py-2.5 text-xs tracking-wider uppercase"
			>
				reset
			</button>
		{/if}
	</div>
	{#if verdict === 'tts-ok'}
		<p class="text-olive-deep mt-4 text-sm">Voices are on. Vocab cards and dialogues across the app now play.</p>
	{:else if verdict === 'text-only'}
		<p class="text-clay-deep mt-4 text-sm">Text-only mode. Generated audio is hidden everywhere; authentic clips stay.</p>
	{/if}
</div>

<p class="text-ink-faint mt-8 max-w-[68ch] text-xs leading-relaxed">
	Pipeline notes: voices and dialect-instruction recipe are documented in RESOURCES.md; regenerating or
	adding audio is <code>node scripts/tts.mjs</code> with the manifest — full Unit 1 costs under $0.10.
	If 3.1 clearly beats 2.5 in sample 2 vs 1b, future dialogues switch models (2× cost, still cents).
</p>

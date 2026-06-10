<script lang="ts" module>
	let current: HTMLAudioElement | null = null;
	let stopCurrent: (() => void) | null = null;
</script>

<script lang="ts">
	import { base } from '$app/paths';
	import { progress } from '$lib/progress.svelte';

	let {
		src,
		size = 'md',
		label = 'Play audio'
	}: { src: string; size?: 'sm' | 'md' | 'lg'; label?: string } = $props();

	let playing = $state(false);
	let missing = $state(false);

	// The naturalness gate: TTS-sourced audio disappears if the user ruled it out.
	const hidden = $derived(progress.audioVerdict === 'text-only' && src.startsWith('audio/tts/'));

	function toggle() {
		if (playing) {
			stopCurrent?.();
			return;
		}
		stopCurrent?.();
		const audio = new Audio(`${base}/${src}`);
		// Global slow mode: 0.8× with pitch preserved (modern Chromium/Safari default).
		audio.playbackRate = progress.slowAudio ? 0.8 : 1;
		audio.preservesPitch = true;
		current = audio;
		const stop = () => {
			audio.pause();
			playing = false;
			if (current === audio) {
				current = null;
				stopCurrent = null;
			}
		};
		stopCurrent = stop;
		audio.onended = stop;
		audio.onerror = () => {
			missing = true;
			stop();
		};
		audio
			.play()
			.then(() => (playing = true))
			.catch(() => {
				missing = true;
				stop();
			});
	}

	const dims = $derived({ sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12' }[size]);
	const icon = $derived({ sm: 10, md: 12, lg: 16 }[size]);
</script>

{#if !hidden}
	<button
		type="button"
		onclick={toggle}
		aria-label={label}
		title={missing ? 'Audio not generated yet' : label}
		disabled={missing}
		class="inline-flex {dims} shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 active:scale-[0.94]
		{playing
			? 'border-clay bg-clay text-paper'
			: missing
				? 'border-line bg-paper-deep text-ink-faint opacity-40'
				: 'border-olive/40 bg-olive-wash text-olive-deep hover:border-olive hover:bg-olive hover:text-paper'}"
	>
		{#if playing}
			<svg width={icon} height={icon} viewBox="0 0 12 12" fill="currentColor"><rect width="12" height="12" rx="1.5" /></svg>
		{:else}
			<svg width={icon} height={icon} viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.2c0-.6.65-.97 1.17-.66l8 4.8a.77.77 0 0 1 0 1.32l-8 4.8A.77.77 0 0 1 2 10.8z" /></svg>
		{/if}
	</button>
{/if}

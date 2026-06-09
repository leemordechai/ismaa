<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();

	const nav = [
		{ href: `${base}/`, label: 'The Path' },
		{ href: `${base}/review/`, label: 'Review' },
		{ href: `${base}/audio-lab/`, label: 'Audio Lab' }
	];

	const isActive = (href: string) =>
		href === `${base}/` ? page.url.pathname === `${base}/` : page.url.pathname.startsWith(href);
</script>

<div class="mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-5 sm:px-8">
	<header class="border-line flex items-center justify-between gap-4 border-b py-4">
		<a href="{base}/" class="group flex items-baseline gap-3">
			<span class="font-ar text-3xl leading-none" dir="rtl">اِسْمَع</span>
			<span class="text-ink-soft hidden text-[11px] font-medium tracking-[0.22em] uppercase sm:inline"
				>Ismaʿ · Palestinian Arabic by ear</span
			>
		</a>
		<nav class="flex items-center gap-1 text-sm">
			{#each nav as item}
				<a
					href={item.href}
					class="rounded-full px-3 py-1.5 transition-colors {isActive(item.href)
						? 'bg-ink text-paper'
						: 'text-ink-soft hover:text-ink'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</header>

	<main class="flex-1 pb-20">
		{@render children()}
	</main>

	<footer class="border-line text-ink-faint border-t py-6 text-xs leading-relaxed">
		<p>
			Built for one learner. Trajectory in <span class="font-medium">CURRICULUM.md</span> · sources &
			licensing in <span class="font-medium">RESOURCES.md</span> · urban Palestinian koine, native review
			pending.
		</p>
	</footer>
</div>

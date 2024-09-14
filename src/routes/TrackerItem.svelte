<script lang="ts">
	import type { PEvent, PResults } from '$lib/types';
	import { draggable } from '@neodrag/svelte';
	import Event from './[ind=number]/Event.svelte';
	import { trackers } from '$lib';
	import { tweened } from 'svelte/motion';
	import { expoOut, quartOut } from 'svelte/easing';

	export let i: number;
	export let tracker: PResults;
	export let events: PEvent[] | undefined;

	const offset = tweened(0, { easing: expoOut, duration: 500 });
	$: style =
		$offset >= 0
			? `
				transform: translate(${50 * (1 - Math.exp((-0.6 * $offset) / 50))}px, 0px);
			`
			: `
				opacity: ${100 + $offset}%;
				filter: blur(${-$offset / 10}px);
				transform: translate(${-$offset * 1.5}px, 0px) scale(${-$offset / 100 + 1});
				z-index: 51;
				overflow: auto;
			`;
</script>

<a
	href="/{i}"
	class="block p-2 pb-0"
	use:draggable={{
		axis: 'x',
		position: { x: $offset, y: 0 },
		transform: () => {},
		onDrag: ({ offsetX }) => offset.set(offsetX, { duration: 0 }),
		onDragEnd: () => {
			if ($offset < -50) {
				offset.set(-100);
				setTimeout(() => ($trackers = $trackers.filter((_, t) => t != i)), 200);
			} else offset.set(0);
		}
	}}
	style="{style} {Math.abs($offset) > 0 ? 'touch-action: none;' : ''}"
>
	<h2 class="text-lg font-semibold" style="view-transition-name: title-{tracker.mp.uuid}">
		{tracker.mp.note || tracker.tracking_reference}
	</h2>
	<Event event={events?.[events?.length - 1]} informative={false} last uuid={tracker.mp.uuid} />
</a>

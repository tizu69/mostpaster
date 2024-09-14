<script lang="ts">
	import { trackers } from '$lib';
	import { migrateData } from '$lib/postie';
	import TrackerItem from './TrackerItem.svelte';
	import TrackNewPackage from './TrackNewPackage.svelte';
	import { flip } from 'svelte/animate';

	$trackers = migrateData($trackers);
</script>

<div class="sticky top-0 z-50 flex gap-2 bg-surface0 p-3">
	Mostpaster ({$trackers.length} trackers)
</div>

<ul class="h-fit w-screen overflow-x-hidden">
	{#each $trackers as tracker, i (tracker.mp.uuid)}
		{@const events = tracker.tracking_events}
		<li animate:flip={{ duration: 300 }} class="border-b">
			<TrackerItem {tracker} {i} {events} />
		</li>
	{:else}
		<li class="p-4 text-center space-y-2 border-b h-[60vh] grid items-center">
			<div>
				<h2 class="text-xl font-bold">Bit empty here, don't you think?</h2>
				<p>Click the button below to add a new NZ post tracker.</p>
			</div>
		</li>
	{/each}
	<li class="grid items-center p-4 *:mx-auto *:w-fit">
		<TrackNewPackage />
	</li>
	<li class="mb-4 text-center text-xs text-subtext1">Developed with &lt;3 in Germany :3</li>
</ul>

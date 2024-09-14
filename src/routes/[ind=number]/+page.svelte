<script lang="ts">
	import { page } from '$app/stores';
	import { trackers } from '$lib';
	import { getIcon } from '$lib/postie';
	import type { PResults } from '$lib/types';
	import { ChevronLeftIcon } from 'lucide-svelte';
	import Event from './Event.svelte';
	import moment from 'moment';

	const tracker = $trackers[Number($page.params.ind)] as PResults;
</script>

{#if tracker}
	<div
		class="sticky top-0 z-50 flex gap-2 bg-surface0 p-3 transition-[filter] has-[input:focus]:brightness-125"
	>
		<a href="/" class="grid items-center" on:click|preventDefault={() => history.back()}>
			<ChevronLeftIcon class="size-5" />
		</a>
		<input
			bind:value={tracker.mp.note}
			maxlength="100"
			class="w-full bg-transparent outline-none"
			placeholder="What am I?"
			style="view-transition-name: title-{tracker.mp.uuid}"
		/>
	</div>

	<div class="p-2 pl-10 text-xs text-subtext1">
		<p>Known as <span class="sel">{tracker.tracking_reference}</span></p>
		<p>Last refreshed {moment(tracker.mp.refreshed).fromNow()}</p>
		<p>Started tracking {moment(tracker.mp.added).fromNow()}</p>
	</div>

	<ul>
		{#each [...(tracker?.tracking_events || [])].reverse() as event, i}
			{#if event.status != 'Delivered' && i == 0}
				<li class="ml-6 p-2 pl-8 pr-4 text-sm text-subtext1">Pending delivery</li>
			{/if}
			<Event {event} uuid={tracker.mp.uuid} last={i == 0} />
		{/each}
		<li class="ml-6">
			<div class="border-l-2 border-dotted border-blue p-2 pl-8 pr-4">
				<p class="text-sm text-subtext1">Requested shipment</p>
			</div>
		</li>
	</ul>
{:else}
	<div class="sticky top-0 z-50 flex gap-2 bg-surface0 p-3">
		<a href="/" class="grid items-center">
			<ChevronLeftIcon class="size-5" />
		</a>
		<input value="Parcel" class="w-full bg-transparent outline-none" readonly />
	</div>

	<ul>
		<li class="ml-6">
			<div class="border-stop border-l-2 border-blue p-2 pl-8 pr-4">
				<p class="text-sm text-red">
					Sorry, we lost your parcel code. Only the code, not the parcel. Oopsie woopsie!
				</p>
			</div>
		</li>
		<li class="ml-6">
			<div class="border-l-2 border-dotted border-blue p-2 pl-8 pr-4">
				<p class="text-sm text-subtext1">Requested lookup</p>
			</div>
		</li>
	</ul>
{/if}

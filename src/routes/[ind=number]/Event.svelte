<script lang="ts">
	import { getIcon } from '$lib/postie';
	import type { PEvent } from '$lib/types';
	import moment from 'moment';

	export let uuid: string;
	export let event: PEvent | undefined;
	export let informative = true;
	export let last = false;
</script>

{#if event}
	<li class="relative ml-6">
		<div
			class="border-l-2 p-2 pl-8 pr-4 {event.status == 'Delivered' || last
				? 'border-stop border-transparent'
				: 'border-blue'} {$$restProps.class}"
		>
			<svelte:component
				this={getIcon(event.status)}
				class="absolute -left-[15.5px] top-1/2 size-8 -translate-y-1/2 rounded-full bg-blue p-1 text-base"
				style={last ? `view-transition-name: event-${uuid}-icon` : ''}
			/>
			<h3 style={last ? `view-transition-name: event-${uuid}` : ''}>{event.status}</h3>
			{#if informative}
				<p class="text-sm text-subtext1">
					{event.description}
					{moment(event.date_time).fromNow()}
				</p>
			{/if}
		</div>
	</li>
{:else}
	<li class="ml-6">
		<div class="border-l-2 border-dotted border-blue p-2 pl-8 pr-4">
			<p class="text-sm text-subtext1">Requested shipment</p>
		</div>
	</li>
{/if}

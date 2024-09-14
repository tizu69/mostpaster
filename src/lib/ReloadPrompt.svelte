<script lang="ts">
	import { Drawer } from 'vaul-svelte';

	const chan = new BroadcastChannel('mostpaster-updates');
	let data: { version: string; changelog: string } | null = null;
	chan.addEventListener('message', (e) => {
		data = e.data;
	});
</script>

{#if data}
	<Drawer.Root shouldScaleBackground open>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-mantle/50" />
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col space-y-4 rounded-t-xl bg-base p-4"
			>
				<div class="mx-auto h-1 w-8 rounded-full bg-surface0" />

				<h2 class="text-2xl font-bold">Mostpaster {data.version}</h2>
				<pre class="text-sm text-subtext0">{data.changelog}</pre>
				<button class="btn" on:click={() => (data = null)}> Cool! </button>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{/if}

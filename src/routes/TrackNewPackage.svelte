<script lang="ts">
	import { trackers } from '$lib';
	import type { PResponse } from '$lib/types';
	import { uuidv4 } from '$lib/utils';
	import { MapPinnedIcon, PackageIcon, PlusIcon } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';

	let open = false;
	let tcode = '';
	let tnote = '';
	let processing = false;
	let error: string | null = null;

	$: alreadyExists = !!$trackers.find((x) => x.tracking_reference == tcode);

	const err = (e: string) => ((error = e), (processing = false));
	const handleNewTrack = async (r: Response) => {
		// blue's shitty api returns 200 no matter what, so this shouldn't happen
		if (!r.ok) return err('Sorry, but the API Mostpaster uses appears to be down.');

		const body = (await r.json().catch(err)) as PResponse;
		console.log(body);

		if (!body.success || body.status_code != 1)
			return err('Cannot find your parcel. Is the code valid?');
		if (!body.results || !body.results[0])
			return err("Something happened that I didn't account for.");

		$trackers = [
			...$trackers,
			{
				...body.results[0],
				mp: {
					note: tnote,
					uuid: uuidv4(),
					added: Date.now(),
					refreshed: Date.now()
				}
			}
		];

		open = false;
	};
</script>

<Drawer.Root
	shouldScaleBackground
	dismissible={!processing}
	onClose={() =>
		setTimeout(() => {
			tcode = '';
			tnote = '';
			processing = false;
			error = null;
		}, 500)}
	bind:open
>
	<Drawer.Trigger>
		<button
			class="
				flex gap-2 rounded-xl p-3
				{$trackers.length > 0 ? 'bg-surface0' : 'bg-blue text-base'}
				hover:brightness-105 active:brightness-95
			"
		>
			<PlusIcon /> Track a new parcel
		</button>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 bg-mantle/50" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col space-y-4 rounded-t-xl bg-base p-4"
		>
			<div
				class="mx-auto h-1 w-8 rounded-full bg-surface0 transition-[opacity] {processing &&
					'opacity-0'}"
			/>

			<h2 class="text-2xl font-bold">Track a new parcel.</h2>
			<p class="text-sm {error ? 'text-red' : 'text-subtext0'}">
				{error ??
					"Enter a tracking code to have Mostpaster track where it is and what it's doing." +
						" It'll save this locally so that you can access information, even if you're offline."}
			</p>

			<form
				class="space-y-2"
				on:submit|preventDefault={() => {
					processing = true;
					error = null;

					fetch(
						'http://postmaster-proxy.bluemethyst.workers.dev/track?tracking_reference=' +
							encodeURIComponent(tcode)
					)
						.then(handleNewTrack)
						.catch((e) => err(e + ' - are you online?'));
				}}
			>
				<div class="relative">
					<PackageIcon class="input-icon" />
					<input
						class="input !pl-8"
						type="text"
						required
						maxlength="50"
						placeholder="Tracking code"
						bind:value={tcode}
						readonly={processing}
					/>
				</div>
				<div class="relative">
					<MapPinnedIcon class="input-icon" />
					<input
						class="input !pl-8"
						type="text"
						maxlength="100"
						placeholder="Item name (optional)"
						bind:value={tnote}
						readonly={processing}
					/>
				</div>

				<button class="btn" disabled={tcode.length <= 0 || processing}>
					{alreadyExists ? 'Track again' : 'Track'}
				</button>
			</form>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<script lang="ts">
	import '../app.css';
	import '../transitions.css';

	import ReloadPrompt from '$lib/ReloadPrompt.svelte';
	import { onNavigate } from '$app/navigation';
	import updateAll from '../service-worker/updateAll';
	import { onMount } from 'svelte';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onMount(async () => {
		updateAll().then(() => {}); // this won't update if you're offline.
		const registration = await navigator.serviceWorker.ready;
		if (
			'periodicSync' in registration &&
			// @ts-expect-error idk the types are dum
			(await navigator.permissions.query({ name: 'periodic-background-sync' })).state == 'granted'
		) {
			// @ts-expect-error idk the types are dum
			const tags = await registration.periodicSync.getTags();
			if (!tags.includes('mostpaster')) {
				try {
					// @ts-expect-error idk the types are dum
					await registration.periodicSync.register('mostpaster', { minInterval: 60 * 1000 });
				} catch (err) {
					console.error(err);
				}
			}
		}
	});
</script>

<ReloadPrompt />

<div data-vaul-drawer-wrapper class="min-h-screen bg-base">
	<div class="relative"><slot /></div>
</div>

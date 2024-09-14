/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';
import changelog from './changelog';
import updateAll from './updateAll';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
	sw.skipWaiting();
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(ASSETS);
		})()
	);
	/* setTimeout(
		() =>
			new BroadcastChannel('mostpaster-updates').postMessage({
				version,
				changelog
			}),
		5000
	); */
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) if (key != CACHE) await caches.delete(key);
		})()
	);
});

sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) return response;
		}

		try {
			const response = await fetch(event.request);
			if (!(response instanceof Response)) throw new Error('invalid response from fetch');
			if (response.status == 200 && !response.url.includes('postmaster'))
				cache.put(event.request, response.clone());
			return response;
		} catch (err) {
			const response = await cache.match(event.request);
			if (response && !response.url.includes('postmaster')) return response;
			throw err;
		}
	}

	event.respondWith(respond());
});

sw.addEventListener('periodicsync', (event: any) => {
	if (event.tag == 'mostpaster') event.waitUntil(updateAll());
});

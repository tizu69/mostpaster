/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import type { PResults, PResponse } from '../lib/types';

export default async () => {
	try {
		const trackers = JSON.parse(localStorage.getItem('mostpaster-trackers') ?? '[]') as PResults[];
		const err = (m: string) => {
			throw new Error(m);
		};

		for await (const tracker of trackers) {
			const r = await fetch(
				'http://postmaster-proxy.bluemethyst.workers.dev/track?tracking_reference=' +
					encodeURIComponent(tracker.tracking_reference)
			);
			if (!r.ok) return err('Sorry, but the API Mostpaster uses appears to be down.');
			const body = (await r.json().catch(err)) as PResponse;
			if (!body.success || body.status_code != 1)
				return err('Cannot find your parcel. Is the code valid?');
			if (!body.results || !body.results[0])
				return err("Something happened that I didn't account for.");

			tracker.tracking_events = body.results?.[0].tracking_events;
			tracker.mp = {
				...tracker.mp,
				refreshed: Date.now()
			};
		}

		localStorage.setItem('mostpaster-trackers', JSON.stringify(trackers));
	} catch (e) {
		console.log(e);
	}
};

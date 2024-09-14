import { persisted as persistable } from 'svelte-persisted-store';
import type { PResults } from './types';

export const trackers = persistable<PResults[]>('mostpaster-trackers', []);

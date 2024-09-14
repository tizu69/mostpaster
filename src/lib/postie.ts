import {
	InfoIcon,
	PackageCheckIcon,
	PlaneLandingIcon,
	PlaneTakeoffIcon,
	TruckIcon,
	WarehouseIcon
} from 'lucide-svelte';
import type { PResults } from './types';
import { uuidv4 } from './utils';

export const getIcon = (status: string) => {
	const s = status.toLowerCase();
	if (s.includes('delivered')) return PackageCheckIcon;
	if (s.includes('transit') || s.includes('with courier')) return TruckIcon;
	if (s.includes('depot')) return WarehouseIcon;
	if (s.includes('international departure')) return PlaneTakeoffIcon;
	if (s.includes('international arrival')) return PlaneLandingIcon;
	return InfoIcon;
};

export const migrateData = (data: PResults[]): PResults[] =>
	data.map((d) => {
		d.mp.uuid ??= uuidv4();
		d.mp.added ??= Date.now();
		d.mp.refreshed ??= Date.now();
		return d;
	});

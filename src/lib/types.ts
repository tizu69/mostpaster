export interface PResponse {
	success: boolean;
	status_code: 1 | 2;
	results?: PResults[];
}

export interface PResults {
	tracking_reference: string;
	tracking_events?: PEvent[];
	/** Mostpaster additions */
	mp: PMostpaster;
}

export interface PEvent {
	edifact_code: number;
	date_time: Date;
	description: string;
	depot_name?: string;
	status: string;
	signed_by?: {
		name: string;
		signature?: string;
	};
}

export interface PMostpaster {
	note: string;
	uuid: string;
	added: number;
	refreshed: number;
}

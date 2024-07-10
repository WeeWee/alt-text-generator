export interface IntegrationImage {
	id: string;
	name: string;
	source: string;
	tags: string[] | null;
	url: string;
	context: {
		custom: {
			alt: string;
		};
	} | null;
	created_at: Date;
	updated_at: Date;
}

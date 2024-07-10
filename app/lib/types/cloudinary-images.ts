export interface CloudinaryImages {
	total_count: number;
	time: number;
	next_cursor: string;
	resources: {
		asset_id: string;
		public_id: string;
		asset_folder: string;
		filename: string;
		display_name: string;
		format: string;
		version: number;
		resource_type: string;
		type: string;
		created_at: Date;
		uploaded_at: Date;
		bytes: string;
		backup_bytes: number;
		width: number;
		height: number;
		aspect_ratio: number;
		pixels: number;
		url: string;
		secure_url: string;
		status: string;
		access_mode: string;
		access_control: null;
		etag: string;
		created_by: null;
		uploaded_by: null;
		context: {
			custom: {
				alt: string;
			};
		};
		tags: string[];
		last_updated: {
			updated_at: Date;
		};
	}[];
}

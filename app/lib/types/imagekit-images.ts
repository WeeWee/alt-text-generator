export interface ImagekitImages
	extends Array<{
		fileId: string;
		type: string;
		name: string;
		filePath: string;
		tags: string[];
		url: string;
		thumbnail: string;
	}> {}

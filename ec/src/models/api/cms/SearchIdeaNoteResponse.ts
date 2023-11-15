import { ApiResponse } from '@/models/api/ApiResponse';

export interface SearchIdeaNoteResponse extends ApiResponse {
	searchBeanList: IdeaNote[];
	searchCount: number;
}

export interface IdeaNote {
	eglibCatchCopy: string;
	eglibCd: string;
	eglibName: string;
	eglibNameForAlt?: string;
	link: string;
	text: string;
	title?: string;
}

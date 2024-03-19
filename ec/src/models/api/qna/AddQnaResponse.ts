import { QnaApiResponse } from '@/models/api/qna/QnaApiResponse';

export interface AddQnaResponse extends QnaApiResponse {
	status: string;
	slang?: string[];
	action?: string[];
}

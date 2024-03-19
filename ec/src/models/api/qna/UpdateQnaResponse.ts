import { QnaApiResponse } from '@/models/api/qna/QnaApiResponse';

export interface UpdateQnaResponse extends QnaApiResponse {
	status: string;
	slang?: string[];
	action?: string[];
}

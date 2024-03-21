import { QnaApiResponse } from '@/models/api/qna/QnaApiResponse';

export interface AddQnaLikeResponse extends QnaApiResponse {
	status?: string;
	message?: string;
}

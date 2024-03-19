import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';

export interface SearchQnaCountRequest extends QnaApiRequest {
	series_code: string;
	/** userInfo userCode */
	reg_id: string;

	qna_id?: number;
}

import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';

export interface DeleteQnaRequest extends QnaApiRequest {
	reg_id: string;
	reg_nm: string;
	qna_id: number;
}

import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';

export interface UpdateQnaRequest extends QnaApiRequest {
	content: string;
	part_no: string;
}

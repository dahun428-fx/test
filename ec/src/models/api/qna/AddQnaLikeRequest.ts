import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';

export interface AddQnaLikeRequest extends QnaApiRequest {
	qna_id: number;
	/** userInfo userCode */
	reg_id: string;
	/** userInfo userName */
	reg_name: string;
	/** userInfo customerCode */
	reg_code: string;
	/** userInfo customerName */
	reg_company: string;
	/** customerInfo tel */
	reg_tel: string;
}

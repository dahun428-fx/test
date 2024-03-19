import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';

export interface AddQnaRequest extends QnaApiRequest {
	content: string;
	part_no: string;
	reg_id: string;
	reg_name: string;
	reg_code: string;
	reg_company: string;
	reg_tel: string;
	reg_email: string;
	series_code: string;
	series_name: string;
	category_code: string;
	category_name: string;
	brand_code: string;
	brand_name: string;
	contact_name: string;
}

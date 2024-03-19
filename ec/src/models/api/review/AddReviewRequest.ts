import { ReviewApiRequest } from '@/models/api/review/ReviewApiRequest';

export interface AddReviewRequest extends ReviewApiRequest {
	score: number;
	use_purpose: string;
	content: string;
	reg_id: string;
	reg_name: string;
	reg_code: string;
	reg_company: string;
	reg_tel: string;
	series_code: string;
	series_name: string;
	category_code: string;
	category_name: string;
	brand_code: string;
	brand_name: string;
	contact_name: string;
}

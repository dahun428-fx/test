import { ReviewApiRequest } from '@/models/api/review/ReviewApiRequest';

export interface AddReviewLikeRequest extends ReviewApiRequest {
	review_id: number;
	reg_id: string;
	reg_name: string;
	reg_code: string;
	reg_company: string;
	reg_tel: string;
}

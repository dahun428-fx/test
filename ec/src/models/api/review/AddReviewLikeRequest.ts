import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

export interface AddReviewLikeRequest extends MsmApiRequest {
	review_id: number;
	reg_id: string;
	reg_name: string;
	reg_code: string;
	reg_company: string;
	reg_tel: string;
}

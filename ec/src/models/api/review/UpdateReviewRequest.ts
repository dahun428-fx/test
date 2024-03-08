import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

export interface UpdateReviewRequest extends MsmApiRequest {
	score: number;
	use_purpose: string;
	content: string;
}

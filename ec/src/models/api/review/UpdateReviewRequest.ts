import { ReviewApiRequest } from '@/models/api/review/ReviewApiRequest';

export interface UpdateReviewRequest extends ReviewApiRequest {
	score: number;
	use_purpose: string;
	content: string;
}

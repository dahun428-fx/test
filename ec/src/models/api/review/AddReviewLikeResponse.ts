import { ReviewApiResponse } from '@/models/api/review/ReviewApiResponse';

export interface AddReviewLikeResponse extends ReviewApiResponse {
	status?: string;
	message?: string;
}

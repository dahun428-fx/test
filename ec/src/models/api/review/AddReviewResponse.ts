import { ReviewApiResponse } from '@/models/api/review/ReviewApiResponse';

export interface AddReviewResponse extends ReviewApiResponse {
	status: string;
	slang?: string[];
}

import { ReviewApiResponse } from '@/models/api/review/ReviewApiResponse';

export interface UpdateReviewResponse extends ReviewApiResponse {
	status: string;
	slang?: string[];
}

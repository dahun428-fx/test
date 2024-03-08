import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

export interface AddReviewResponse extends MsmApiResponse {
	status: string;
	slang?: string[];
}

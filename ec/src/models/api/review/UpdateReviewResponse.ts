import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

export interface UpdateReviewResponse extends MsmApiResponse {
	status: string;
	slang?: string[];
}

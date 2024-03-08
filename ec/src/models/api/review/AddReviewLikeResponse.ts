import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

export interface AddReviewLikeResponse extends MsmApiResponse {
	status?: string;
	message?: string;
}

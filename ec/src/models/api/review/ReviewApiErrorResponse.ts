import { ApiErrorResponse } from '@/models/api/ApiErrorResponse';

export interface ReviewApiErrorResponse extends ApiErrorResponse {
	status: string;
	message?: string;
}

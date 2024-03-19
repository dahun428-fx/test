import { ApiErrorResponse } from '@/models/api/ApiErrorResponse';

export interface QnaApiErrorResponse extends ApiErrorResponse {
	status: string;
	message?: string;
}

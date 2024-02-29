import { ApiErrorResponse } from '../ApiErrorResponse';

export interface ReviewApiErrorResponse extends ApiErrorResponse {
	status: string;
	message?: string;
}

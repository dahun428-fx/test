import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';
import { ReviewApiErrorResponse } from '@/models/api/review/ReviewApiErrorResponse';

/**
 * Review API error
 */
export class ReviewApiError extends ApiError<ReviewApiErrorResponse> {
	constructor(error: AxiosError<ReviewApiErrorResponse>) {
		super(error);
		this.name = 'ReviewApiError';
	}
}

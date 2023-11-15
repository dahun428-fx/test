import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';
import { SinusApiErrorResponse } from '@/models/api/sinus/SinusApiErrorResponse';

/**
 * SINUS API error
 */
export class SinusApiError extends ApiError<SinusApiErrorResponse> {
	constructor(error: AxiosError<SinusApiErrorResponse>) {
		super(error);
		this.name = 'SinusApiError';
	}
}

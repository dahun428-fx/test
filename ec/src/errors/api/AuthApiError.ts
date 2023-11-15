import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';

/**
 * Auth API error
 */
export class AuthApiError extends ApiError<unknown> {
	constructor(error: AxiosError<unknown>) {
		super(error);
		this.name = 'AuthApiError';
	}
}

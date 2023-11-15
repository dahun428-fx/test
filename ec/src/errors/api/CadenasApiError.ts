import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';

/**
 * CADENAS PHP API error
 */
export class CadenasApiError extends ApiError<unknown> {
	constructor(error: AxiosError<unknown>) {
		super(error);
		this.name = 'CadenasApiError';
	}
}

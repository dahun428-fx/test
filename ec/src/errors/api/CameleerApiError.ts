import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';

/**
 * Cameleer API error
 */
export class CameleerApiError extends ApiError<unknown> {
	constructor(error: AxiosError<unknown>) {
		super(error);
		this.name = 'CameleerApiError';
	}
}

import { AxiosError } from 'axios';
import { ApiError } from '@/errors/api/ApiError';
import { RefreshTokenErrorResponse } from '@/models/api/auth/token/RefreshTokenErrorResponse';
import { isObject } from '@/utils/object';

export class TokenRefreshError extends ApiError<RefreshTokenErrorResponse> {
	readonly type: string;

	constructor(error: AxiosError) {
		const data = isObject<RefreshTokenErrorResponse>(error.response?.data)
			? error.response?.data
			: undefined;
		const type = String(data?.error) ?? 'unknown';
		super(error, `Token Refresh Error Occurred: ${type}`);
		this.type = type;
		this.name = 'TokenRefreshError';
	}
}

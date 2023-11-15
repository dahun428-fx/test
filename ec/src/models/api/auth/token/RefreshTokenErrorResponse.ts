import { AuthApiResponse } from '@/models/api/auth/AuthApiResponse';

export interface RefreshTokenErrorResponse extends AuthApiResponse {
	error?: string;
	error_description?: string;
}

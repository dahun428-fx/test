import { AuthApiRequest } from '@/models/api/auth/AuthApiRequest';

/**
 * リフレッシュトークンリクエスト
 */
export interface RefreshTokenRequest extends AuthApiRequest {
	/** リフレッシュトークンハッシュ値 */
	refreshTokenHash: string;
}

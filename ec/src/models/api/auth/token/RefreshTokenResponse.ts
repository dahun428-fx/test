import { AuthApiResponse } from '@/models/api/auth/AuthApiResponse';
import { SnakePropsToCamel } from '@/utils/type';

/**
 * リフレッシュトークンレスポンス(内部用)
 */
export interface RawRefreshTokenResponse extends AuthApiResponse {
	/** アクセストークン */
	access_token: string;
	/** アクセストークン代理キー */
	access_token_key: string;
	/** リフレッシュトークン */
	refresh_token: string;
	/** リフレッシュトークンハッシュ値 */
	refresh_token_hash: string;
	/** アクセストークン有効秒数(epoch) */
	expires_in: number;
}

/**
 * リフレッシュトークンレスポンス
 */
export interface RefreshTokenResponse
	extends SnakePropsToCamel<RawRefreshTokenResponse> {}

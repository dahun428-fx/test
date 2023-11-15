import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** ログインAPIリクエスト */
export interface LoginRequest extends MsmApiRequest {
	/**
	 * ログインID
	 * - ログインするユーザのログインID
	 */
	loginId: string;
	/**
	 * パスワード
	 * - ログインするユーザのパスワード
	 */
	password: string;
}

import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** キーワードバナー取得APIリクエスト */
export interface GetKeywordBannerRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - 入力キーワードを設定する
	 * - maxLength: 100
	 * - example: シャフト
	 */
	keyword: string;
}

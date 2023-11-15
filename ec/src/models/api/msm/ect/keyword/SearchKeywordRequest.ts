import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 関連キーワード検索APIリクエスト */
export interface SearchKeywordRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - 入力キーワードを設定する
	 * - maxLength: 100
	 * - example: シャフト
	 */
	keyword: string;
	/**
	 * 取得件数
	 * - 取得するレコード件数を指定する
	 * - minLength: 1
	 * - default: ５
	 * - example: 1
	 */
	count?: number;
}

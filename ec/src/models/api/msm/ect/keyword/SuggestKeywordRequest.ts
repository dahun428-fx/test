import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** キーワードサジェスト検索APIリクエスト */
export interface SuggestKeywordRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - 検索キーワード
	 * - maxLength: 100
	 * - example: シャフト
	 */
	keyword: string;
	/**
	 * 取得件数
	 * - キーワードサジェストで返却される件数
	 * - default: 10
	 * - example: 10
	 */
	count?: number;
}

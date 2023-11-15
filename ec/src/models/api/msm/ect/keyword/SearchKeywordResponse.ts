import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 関連キーワード検索APIレスポンス */
export interface SearchKeywordResponse extends MsmApiResponse {
	/**
	 * キーワードリスト
	 * - 入力したキーワードに関連する、その他の検索キーワードリスト
	 */
	keywordList: string[];
}

import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 技術情報全文検索APIレスポンス */
export interface SearchTechFullTextResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索結果総件数
	 */
	totalCount: number;
	/**
	 * 検索結果リスト
	 * - 検索結果のリスト
	 */
	resultList: Result[];
}

/** 検索結果 */
export interface Result {
	/**
	 * タイトル
	 * - 検索条件に一致したページのタイトル
	 */
	title: string;
	/**
	 * テキスト
	 * - 検索条件に一致したページの説明文章
	 */
	text: string;
	/**
	 * URL
	 * - 検索条件に一致したページのURL
	 */
	url: string;
}

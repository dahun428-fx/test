import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** InCADComponents全文検索APIリクエスト */
export interface SearchInCADComponentsFullTextRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - 検索対象の文字列
	 */
	keyword: string;
	/**
	 * ページング（開始位置）
	 * - ページングの開始位置
	 * - minLength: 1
	 * - default: 1
	 * - example: 2
	 */
	page?: number;
	/**
	 * ページング（取得件数）
	 * - 1ページあたりの取得件数
	 * - minLength: 1
	 * - maxLength: 100
	 * - default: 10
	 * - example: 40
	 */
	pageSize?: number;
}

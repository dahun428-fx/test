import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** シリーズ検索APIレスポンス */
export interface SearchSeriesResponse$templateType extends MsmApiResponse {
	/**
	 * シリーズ情報リスト
	 * - 検索結果のシリーズ一覧
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	seriesList: Series[];
}

/** シリーズ情報 */
export interface Series {
	/**
	 * 商品画面テンプレートタイプ
	 * - 商品詳細画面の画面テンプレートのタイプ
	 *   1: 通常テンプレート
	 *   2: 単純品テンプレート
	 *   3: Eカタログ未掲載テンプレート(生成パターンH)
	 *   4: WYSIWYG強調表示テンプレート
	 *   7: PU品用テンプレート
	 * - example: 1
	 * - field groups: @detail, @unit, @box
	 * - NOTE: 画面テンプレートの種類に応じてタイプの増減あり
	 */
	templateType: string;
}

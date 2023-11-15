import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** ユニット事例検索APIリクエスト */
export interface SearchUnitLibraryRequest extends MsmApiRequest {
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - NOTE: ユニット事例.コードタイプ=2(カテゴリコード)
	 *         も指定
	 */
	categoryCode?: string;
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - NOTE: ユニット事例.コードタイプ=3(シリーズコード)
	 *         も指定
	 */
	seriesCode?: string;
	/**
	 * 取得件数
	 * - 取得件数
	 * - minLength: 1
	 * - default: 20
	 */
	count?: number;
}

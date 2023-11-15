import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** COMBOサジェスト検索APIリクエスト */
export interface SuggestComboRequest extends MsmApiRequest {
	/**
	 * 型番
	 * - 型番
	 * - maxLength: 100
	 * - example: SFJ3-1000
	 */
	partNumber: string;
	/**
	 * 取得件数
	 * - 返却される最大件数
	 * - minLength: 1
	 * - maxLength: 99
	 * - default: 10
	 * - example: 10
	 */
	count?: number;
	/**
	 * 取得対象外インナーコード
	 * - 情報を取得しないインナーコードの指定
	 * - example: 30007000101,30016100000
	 * - NOTE: カンマで区切ることで複数指定可
	 */
	excludeInnerCode?: string;
}

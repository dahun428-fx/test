import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** タイプ検索APIリクエスト */
export interface SearchTypeRequest extends MsmApiRequest {
	/**
	 * 型番
	 * - 型番やタイプの文字列
	 * - maxLength: 100
	 * - example: SFJ3
	 */
	partNumber: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - example: E1400000000,E2205010000
	 * - NOTE: カテゴリコードでの絞込条件。カンマで区切ることで複数指定可。
	 */
	categoryCode?: string;
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: MSM1,THK1
	 * - NOTE: ブランドコードでの絞込条件。カンマで区切ることで複数指定可。
	 */
	brandCode?: string;
	/**
	 * フィルタタイプ
	 * - 特定のサイト・用途のために検索結果を絞り込むための値
	 *   1: eカタログ表示対象全ての情報を返却する
	 *   2: RapidDesign表示対象の情報のみ返却する
	 *   3: RapidDesign iCAD向け表示対象の情報のみ返却する
	 * - default: 1
	 * - example: 1
	 */
	filterType?: string;
}

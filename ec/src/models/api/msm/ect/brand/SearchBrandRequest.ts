import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** ブランド検索APIリクエスト */
export interface SearchBrandRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - 検索キーワード
	 * - maxLength: 100
	 * - example: ミスミ
	 * - NOTE: 指定しない場合は全件取得
	 */
	keyword?: string;
	/**
	 * ブランドコード
	 * - ブランドコード(例:MSM1)もしくはブランドURLコード(例:misumi)のどちらでも検索可能
	 *   カンマで区切ることで複数指定可能。
	 * - example: MSM1,THK1
	 */
	brandCode?: string | string[];
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 *   カンマで区切ることで複数指定可能
	 * - example: E1400000000,E2205010000
	 */
	categoryCode?: string;
	/**
	 * ソート順
	 * - ソート順を指定
	 *   1: あいうえお順
	 *   2: おすすめ順（キーワード検索）
	 * - default: 1
	 */
	sort?: string;
	/**
	 * ページング（開始位置）
	 * - ページングの開始位置
	 * - minLength: 1
	 * - default: 1
	 * - example: 1
	 */
	page?: number;
	/**
	 * ページング（取得件数）
	 * - 1ページあたりの取得件数
	 * - minLength: 0
	 * - default: 30
	 * - example: 5
	 * - NOTE: 0指定で全件取得
	 */
	pageSize?: number;
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

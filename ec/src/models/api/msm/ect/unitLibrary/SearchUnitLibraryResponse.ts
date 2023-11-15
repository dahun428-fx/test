import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** ユニット事例検索APIレスポンス */
export interface SearchUnitLibraryResponse extends MsmApiResponse {
	/**
	 * ユニット事例リスト
	 * - ユニット事例のリスト
	 * - NOTE: 事例タイプがパラメトリックユニットのものを優先し、ユニット事例.表示順の昇順でソート
	 */
	unitLibraryList: UnitLibrary[];
}

/** ユニット事例 */
export interface UnitLibrary {
	/**
	 * ユニット事例名
	 * - ユニット事例の商品名
	 * - example: ＜平田機工×ミスミ＞スカラロボットによるピックアンドプレース機構
	 */
	unitLibraryName: string;
	/**
	 * ユニット事例ページURL
	 * - ユニット事例ページのURL
	 * - example: //jp.misumi-ec.com/ec/unitlibrary/detail/000684.html
	 * - NOTE: ドメイン名を付与
	 */
	unitLibraryPageUrl: string;
	/**
	 * ユニット事例画像URL
	 * - ユニット事例画像のURL
	 * - example: //jp.misumi-ec.com/msmec/ideanote/000684/img/img_unit_thum.png
	 * - NOTE: ドメイン名を付与
	 */
	unitLibraryImageUrl: string;
	/**
	 * ユニット事例タイプ
	 * - ユニット事例の種別
	 *   1: 通常のユニット事例
	 *   2: パラメトリックユニット
	 * - example: 1
	 */
	unitLibraryType: string;
}

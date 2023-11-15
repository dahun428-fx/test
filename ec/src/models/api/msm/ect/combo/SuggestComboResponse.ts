import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** COMBOサジェスト検索APIレスポンス */
export interface SuggestComboResponse extends MsmApiResponse {
	/**
	 * 型番候補リスト
	 */
	partNumberList: PartNumber[];
}

/** 型番候補 */
export interface PartNumber {
	/**
	 * 型番タイプ
	 * - 検索結果の型番のタイプ
	 *   1: 通常型番
	 *   2: 商品情報未掲載
	 *   3: Eカタログ未掲載
	 * - example: 1
	 */
	partNumberType: SuggestPartNumberType;
	/**
	 * 型番タイプ表示文言
	 * - 注釈の表示文言
	 *   1: (なし)
	 *   2: 商品情報未掲載。見積・注文に進みます。
	 *   3: カタログ未掲載品
	 * - example: 商品情報未掲載。見積・注文に進みます。
	 */
	partNumberTypeDisp?: string;
	/**
	 * 型番
	 * - 候補型番(型番候補、フル型番)
	 * - example: AN
	 */
	partNumber: string;
	/**
	 * ブランドコード
	 * - シリーズの所属するブランドコード
	 * - example: MSM1
	 */
	brandCode: string;
	/**
	 * ブランド名
	 * - 型番のメーカ
	 * - example: ミスミ
	 */
	brandName: string;
	/**
	 * シリーズコード
	 * - 型番のシリーズコード
	 * - example: 110400153530
	 */
	seriesCode: string;
	/**
	 * シリーズ名
	 * - 型番のシリーズ名
	 *   複数のシリーズに紐付いているインナーの場合のみ返却する
	 */
	seriesName?: string;
	/**
	 * インナーコード
	 * - 型番のインナーコード
	 */
	innerCode: string;
	/**
	 * 確定タイプ
	 * - 確定タイプ
	 *   3: インナーまで確定済み
	 *   4: フル型番確定済み
	 * - example: 2
	 * - NOTE: 確定タイプのコード値はシリーズ検索APIのコード値に統一。
	 *         COMBOサジェストAPIでは、「1:シリーズまで確定済み」「2: タイプまで確定済み」は返却しません。
	 */
	completeType: string;
}

/**
 * Part Number Type
 * - Part number type of search results
 *   1:  Standard part number
 *   2:  Product without information posted
 *   3:  Not listed in e Catalog
 */
const SuggestPartNumberType = {
	NORMAL: '1',
	NO_LISTED: '2',
	NO_CATALOG: '3',
} as const;
type SuggestPartNumberType =
	typeof SuggestPartNumberType[keyof typeof SuggestPartNumberType];
export { SuggestPartNumberType };

import { Flag } from '@/models/api/Flag';
import { RoHSType } from '@/models/api/constants/RoHSType';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 関連型番検索APIレスポンス */
export interface SearchRelatedPartNumberResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - field groups: @link
	 */
	totalCount?: number;
	/**
	 * 型番リスト
	 * - field groups: @default, @link
	 */
	partNumberList: PartNumber[];
}

/** 型番 */
export interface PartNumber {
	/**
	 * インナーコード
	 * - MDMの統合インナーコード
	 * - maxLength: 14
	 * - example: MDM00004097801
	 * - field groups: @default
	 */
	innerCode?: string;
	/**
	 * 基幹インナーコード
	 * - 基幹(ZETTA)のインナーコード
	 * - maxLength: 11
	 * - example: 30007000101
	 * - field groups: @default
	 */
	zinnerCode?: string;
	/**
	 * 型番
	 * - 型番
	 * - example: SFJ3-[10-400/1]
	 * - field groups: @default, @link
	 */
	partNumber?: string;
	/**
	 * ホワイトリストタイプ
	 * - サイトマップxml定義のホワイトリストタイプ
	 *   0:対象外
	 *   1:複雑品フル型番
	 *   2:複雑品タイプ型番/単純品タイプ型番
	 * - field groups: @link
	 */
	whiteListType?: string;
	/**
	 * 単純品フラグ
	 * - 単純品かどうか
	 *   0: 単純品でない
	 *   1: 単純品
	 * - field groups: @default
	 */
	simpleFlag?: Flag;
	/**
	 * 通常価格
	 * - 通常価格
	 * - example: 150
	 * - field groups: @default
	 */
	standardUnitPrice?: number;
	/**
	 * キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その価格を返却
	 * - example: 100
	 * - field groups: @default
	 */
	campaignUnitPrice?: number;
	/**
	 * キャンペーン終了日
	 * - キャンペーン値引きの日付が設定されている場合、その日付を返却
	 * - example: yyyy/mm/dd
	 * - field groups: @default
	 */
	campaignEndDate?: string;
	/**
	 * スライド割引フラグ
	 * - スライド値引ありフラグ
	 *   0: スライド割引なし
	 *   1: スライド割引あり
	 *   数量スライド割引※詳細は別紙１を参照
	 * - maxLength: 1
	 * - example: 0
	 * - field groups: @default
	 */
	volumeDiscountFlag: Flag;
	/**
	 * 最小通常出荷日
	 * - 最小通常出荷日
	 * - example: 5
	 * - field groups: @default
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日
	 * - 最大通常出荷日
	 * - example: 5
	 * - field groups: @default
	 */
	maxStandardDaysToShip?: number;
	/**
	 * 最小最短出荷日数
	 * - ストーク適用時の出荷日数の最小値
	 * - field groups: @default
	 */
	minShortestDaysToShip?: number;
	/**
	 * 最大最短出荷日数
	 * - ストーク適用時の出荷日数の最大値
	 * - field groups: @default
	 */
	maxShortestDaysToShip?: number;
	/**
	 * RoHSフラグ
	 * - RoHS対応かどうか
	 *   0: 未調査
	 *   1: RoHS6対応
	 *   2: RoHS10対応
	 *   9: 非対応
	 * - maxLength: 1
	 * - example: 0
	 * - field groups: @default
	 */
	rohsFlag: RoHSType;
	/**
	 * 在庫品フラグ
	 * -   0: 在庫品でない
	 *   1: 在庫品である
	 * - maxLength: 1
	 * - example: 1
	 * - field groups: @default
	 */
	stockItemFlag: Flag;
	/**
	 * パック品入数
	 * - パック品入数
	 * - field groups: @default
	 */
	piecesPerPackage?: number;
	/**
	 * 最低発注数量
	 * - 注文を受け付ける最低数量
	 * - field groups: @default
	 */
	minQuantity?: number;
	/**
	 * 関連情報リスト
	 * - field groups: @default
	 */
	relatedLinkList: RelatedLink[];
	/**
	 * スペック値リスト
	 * - 型番ごとのスペック値のリスト
	 *   要素の並び順はスペック項目リストと同一
	 * - field groups: @default
	 * - NOTE: 値が無い場合は返却しない
	 */
	specValueList: SpecValue[];
}

/** スペック値 */
export interface SpecValue {
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - field groups: @default
	 */
	specCode?: string;
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値。複数の場合はカンマで区切って指定)
	 * - example: D1020.12345!a
	 * - field groups: @default
	 */
	specValue?: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言。スペック情報タイプが 1 のときにセットされる。
	 * - example: [鉄] SUJ2相当
	 * - field groups: @default
	 */
	specValueDisp?: string;
	/**
	 * データ取得元タイプ
	 * - スペック値のデータ取得元(データ基盤の定義元)を表す文字列
	 *   1: データシート
	 *   2: キーリスト
	 *   3: チェックマスタ
	 * - example: 1
	 * - field groups: @default
	 * - NOTE: デバッグモードのみ返却
	 */
	sourceType?: string;
	/**
	 * データ取得元タイプ表示文言
	 * - データ取得元タイプの表示文言
	 *   1: dataSheet
	 *   2: keylist
	 *   3: check
	 * - example: dataSheet
	 * - field groups: @default
	 * - NOTE: デバッグモードのみ返却
	 */
	sourceTypeDisp?: string;
}

/** 関連情報 */
export interface RelatedLink {
	/**
	 * 関連情報
	 * - 関連情報が存在する場合に、以下のいずれかがセットされる
	 *   1: SDS(MSDS)
	 *   2: データシート
	 *   3: ミスミ定期便申し込み
	 *   4: サンプル品提供申し込み
	 * - example: 2
	 * - field groups: @default, @search, @detail
	 */
	relatedLinkType?: RelatedLinkType;
	/**
	 * 関連情報表示文言
	 * - 関連情報表示文言
	 * - example: データシート
	 * - field groups: @default, @search, @detail
	 */
	relatedLinkTypeDisp?: string;
	/**
	 * 関連情報URL
	 * - 関連情報のURL
	 * - example: http://www.nxp.com/documents/data_sheet/PCF8579.pdf
	 * - field groups: @default, @search, @detail
	 */
	relatedInfoUrl?: string;
}

/**
 * 関連情報
 *   1: SDS(MSDS)
 *   2: データシート
 *   3: ミスミ定期便申し込み
 *   4: サンプル品提供申し込み
 */
export const RelatedLinkType = {
	MSDS: '1',
	DATA_SHEET: '2',
	MISUMI_REGULAR_SERVICE: '3',
	REQUEST_SAMPLE: '4',
} as const;
export type RelatedLinkType =
	typeof RelatedLinkType[keyof typeof RelatedLinkType];

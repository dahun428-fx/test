import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 型番検索APIリクエスト */
export interface SearchPartNumberRequest extends MsmApiRequest {
	/**
	 * シリーズコード
	 * - 検索対象とするシリーズコード。
	 * - example: 123456789012
	 */
	seriesCode: string;
	/**
	 * インナーコード
	 * - インナーコードでの絞込条件。カンマで区切ることで複数指定可。
	 * - example: 12345678901,23456789012
	 */
	innerCode?: string | string[];
	/**
	 * 選択項目
	 * - シリーズ絞込条件に指定するスペックコードおよびスペック値を指定
	 * - example: E01=100&E02=10,20
	 * - NOTE: スペックコード＝スペック値の形式で指定。複数指定可。
	 *         E01=100,200＆E02=10,20
	 * @type {string | string[]}
	 */
	[specCode: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	/**
	 * 型番
	 * - シリーズ絞り込み条件に指定する型番候補の文字列を指定
	 * - example: SFJ, SFJ3, SFJ3-[10-400/1], SFJ3-10
	 */
	partNumber?: string | string[];
	/**
	 * 在庫品フラグ
	 * - 在庫品（在庫品の型番を含むシリーズ）で絞り込むかどうか
	 *   0: 絞り込まない
	 *   1: 絞り込む
	 * - minLength: 1
	 * - maxLength: 1
	 * - default: 0
	 */
	stockItemFlag?: Flag;
	/**
	 * 規格廃止品フラグ
	 * - 規格廃止品で絞り込むかどうか
	 *   0: 含まない
	 *   1: 含む
	 * - default: 0
	 * - NOTE: この機能を有効にするためには現法別制御ファイルにて機能の有効化が必要（discontinued:true）
	 */
	discontinuedProductFlag?: Flag;
	/**
	 * 出荷日数
	 * - シリーズ絞り込み条件に指定する出荷日数
	 * - example: 3
	 * - NOTE: 出荷日数での絞込条件。指定された出荷日の型番が存在しない場合は、指定した値に最も近く、かつ、早い出荷日を指定したものと解釈する。
	 */
	daysToShip?: number;
	/**
	 * CADタイプ
	 * - シリーズ絞り込み条件に指定するCADタイプ
	 *   1: 2D
	 *   2: 3D
	 * - example: 1
	 * - NOTE: CADでの絞込条件。カンマで区切ることで複数指定可。
	 */
	cadType?: string | string[];
	/**
	 * ソート順
	 * - ソート順の指定
	 *   1: 通常
	 *   2: 通常出荷日の早い順
	 *   3: 通常出荷日の遅い順
	 *   4: 通常単価の安い順
	 *   5: 通常単価の高い順
	 * - default: 1
	 * - example: 1
	 * - NOTE: 複数の場合はカンマで区切って指定
	 */
	sort?: Sort | Sort[];
	/**
	 * スペックソートフラグ
	 * - 型番絞り込み候補のスペックを並び替えるかどうか
	 *   0: 並び替えない(表示順のまま)
	 *   1: 並び替える(未指定のスペックを上にする)
	 * - default: 1
	 * - example: 1
	 */
	specSortFlag?: Flag;
	/**
	 * 全スペック返却フラグ
	 * - 型番絞り込み候補のスペックとして非表示のものも含めてすべて返却するかどうか
	 *   0: 返却しない(表示するもののみ)
	 *   1: 返却する(非表示のものも含む)
	 * - default: 0
	 * - example: 1
	 */
	allSpecFlag?: Flag;
	/**
	 * ページング（開始位置）
	 * - ページングの開始位置
	 * - default: 1
	 * - example: 2
	 */
	page?: number;
	/**
	 * ページング（取得件数）
	 * - 1ページあたりの取得件数
	 * - default: 30
	 * - example: 40
	 */
	pageSize?: number;
}

/**
 * ソート順
 * - ソート順の指定
 *   1: 通常
 *   2: 通常出荷日の早い順
 *   3: 通常出荷日の遅い順
 *   4: 通常単価の安い順
 *   5: 通常単価の高い順
 * - default: 1
 * - example: 1
 * - NOTE: 複数の場合はカンマで区切って指定
 */

export const Sort = {
	NORMAL: '1',
	SHIP_TO_DAYS_ASC: '2',
	SHIP_TO_DAYS_DESC: '3',
	STANDARD_UNIT_PRICE_ASC: '4',
	STANDARD_UNIT_PRICE_DESC: '5',
} as const;

export type Sort = typeof Sort[keyof typeof Sort];

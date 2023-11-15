import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 型番サジェスト検索APIリクエスト */
export interface SuggestPartNumberRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - サジェスト対象のキーワード
	 * - maxLength: 100
	 * - example: SFJ3
	 */
	keyword: string;
	/**
	 * ブランドコード
	 * - ブランドコード
	 *   カンマで区切ることで複数指定可能
	 * - example: MSM1,THK1
	 */
	brandCode?: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 *   カンマで区切ることで複数指定可能
	 * - example: E1400000000,E2205010000
	 */
	categoryCode?: string;
	/**
	 * 通常検索結果の取得件数
	 * - サジェストで返却される件数
	 * - minLength: 1
	 * - default: 10
	 * - example: 10
	 */
	count?: number;
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
	/**
	 * 規格廃止品検索結果の取得件数
	 * - サジェストで返却される件数
	 * - minLength: 0
	 * - default: 2147483647
	 * - example: 3
	 * - NOTE: 未指定は件数無制限指定。
	 */
	discontinuedCount?: number;
	/**
	 * 型番タイプ
	 * - 検索する型番のタイプ
	 *   1: 通常型番 または 商品情報未掲載　または  Eカタログ未掲載
	 *   4: Cナビ
	 *   5: 規格廃止品
	 *   カンマで区切ることで複数指定可能
	 * - default: 1,4,5
	 * - example: 1
	 */
	partNumberType?: string;
	/**
	 * 重複インナーフラグ
	 * - 1インナー複数シリーズのインナーを重複して返却するかどうか
	 *   0: 重複して返却しない
	 *   1: 重複して返却する
	 * - default: 1
	 * - example: 1
	 */
	duplicateInnerFlag?: Flag;
}

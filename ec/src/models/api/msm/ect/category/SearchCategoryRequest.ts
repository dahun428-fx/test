import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

const AncesterType = {
	/** 取得しない */
	NO_GET: '1',
	/** 直系のトップカテゴリから取得 */
	GET_FROM_DIRECT_TOP_CATEGORY: '2',
	/** 全てのトップカテゴリから取得 */
	GET_FROM_ALL_TOP_CATEGORY: '3',
} as const;
type AncesterType = typeof AncesterType[keyof typeof AncesterType];
export { AncesterType };

/** カテゴリ検索APIリクエスト */
export interface SearchCategoryRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - キーワード検索時に使用
	 * - maxLength: 100
	 * - example: シャフト
	 * - NOTE: キーワードとカテゴリコード、ブランドコードは併用指定不可
	 */
	keyword?: string;
	/**
	 * カテゴリコード
	 * - 取得対象のカテゴリコード
	 * - example: M0101000000,M3306010000
	 * - NOTE: 複数の場合はカンマで指定、未指定の場合は全カテゴリ検索
	 */
	categoryCode?: string | string[];
	/**
	 * ブランドコード
	 * - 取得対象のブランドコード
	 * - example: MSM1,THK1
	 * - NOTE: 複数の場合はカンマで指定、未指定の場合はブランドでの絞り込みを行わない。
	 *         ブランド別カテゴリ画像は１つ目に指定したブランドの画像を返却します。
	 */
	brandCode?: string;
	/**
	 * ブランドモードフラグ
	 * - キーワードの一部にブランド名が指定された場合に、ブランドモード検索を行うかどうか
	 *   0: 行わない
	 *   1: 行う
	 * - maxLength: 1
	 * - default: 1
	 */
	brandModeFlag?: Flag;
	/**
	 * 先祖カテゴリ取得タイプ
	 * - 先祖カテゴリの取得タイプ
	 *   1: 取得しない
	 *   2: 直系のトップカテゴリから取得
	 *   3: 全トップカテゴリから取得
	 *   先祖カテゴリ取得タイプを指定した場合、カテゴリコードは1件のみ指定可能。またキーワード指定やページング指定もできない。
	 * - default: 1
	 * - example: ,
	 * - NOTE: 取得階層数=2のときの返却例
	 *         先祖カテゴリ取得タイプ=2
	 *         ─A1┬A2
	 *             ├B2┬XX┬A4
	 *             └C2├B3└B4
	 *                 └C3
	 *         先祖カテゴリ取得タイプ=3
	 *         ┬A1┬A2
	 *         ├B1├B2┬XX┬A4
	 *         ├C1└C2├B3└B4
	 *         └D1    └C3
	 *         (XXは指定したカテゴリ)
	 */
	ancesterType?: AncesterType;
	/**
	 * 取得階層数
	 * - 子の取得階層数を指定
	 *   0: 最下位層まで取得
	 *   1: 自分自身のみ取得
	 *   2: 子カテゴリまで取得
	 *   3: 孫カテゴリまで取得
	 *   ...
	 * - minLength: 0
	 * - default: 1
	 * - example: 1
	 */
	categoryLevel?: number;
	/**
	 * ページング（開始位置）
	 * - 開始ページ位置を指定
	 * - minLength: 1
	 * - default: 1
	 * - example: 1
	 */
	page?: number;
	/**
	 * ページング（取得件数）
	 * - １ページあたりの取得件数を指定
	 * - minLength: 1
	 * - default: 30
	 * - example: 30
	 */
	pageSize?: number;
	/**
	 * 更新日時
	 * - 前回のカテゴリ検索API呼出しで取得した更新日時
	 * - example: 2016/8/31 17:41:29
	 * - NOTE: 更新日時を指定した場合、指定した日時以降にカテゴリが更新されていた場合のみカテゴリ情報を返却する。更新されていなかった場合は空のカテゴリ情報リストを返却する。
	 *         更新日時を指定しない場合は、更新状態に関わらず常にカテゴリ情報リストを返却する。
	 */
	updateDateTime?: string;
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

import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** シリーズ検索APIリクエスト */
export interface SearchSeriesRequest extends MsmApiRequest {
	/**
	 * キーワード
	 * - 型番もしくはキーワード
	 * - maxLength: 100
	 * - example: シャフト
	 */
	keyword?: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - example: E1400000000,E2205010000
	 * - NOTE: カテゴリコードでの絞込条件。カンマで区切ることで複数指定可。
	 *         TOPカテゴリ指定は禁止。（全商品情報取得の防止）呼び出すとカテゴリコード不正エラーを返却。
	 */
	categoryCode?: string | string[];
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - example: 110100000170,110100000260
	 * - NOTE: シリーズコードでの絞込条件。カンマで区切ることで複数指定可。
	 *         キーワードと同時に指定した場合、指定シリーズをシリーズ情報リストの上位に表示
	 */
	seriesCode?: string | string[];
	/**
	 * インナーコード
	 * - インナーコード
	 * - example: 12345678901,23456789012
	 * - NOTE: インナーコードでの絞込条件。カンマで区切ることで複数指定可。
	 */
	innerCode?: string | string[];
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: misumi
	 * - NOTE: ブランドコードもしくはブランドURLコードでの絞り込み条件。カンマで区切ることで複数指定可
	 */
	brandCode?: string | string[];
	/**
	 * ブランドモードフラグ
	 * - キーワードの一部にブランド名が指定された場合に、ブランドモード検索を行うかどうか
	 *   0: 行わない
	 *   1: 行う
	 * - minLength: 1
	 * - maxLength: 1
	 * - default: 1
	 */
	brandModeFlag?: Flag;
	/**
	 * 対象カタログ
	 * - 対象のカタログとページ番号を'-'(ハイフン)で連結した文字列
	 *   カタログコード値例：
	 *   'MSM1_09': FA用メカニカル標準部品1
	 *   'MSM1_10': FA用メカニカル標準部品2
	 *   'MSM1_E03': FA用エレクトロニクス 配線接続部品
	 *   'MSM1_T03': ファクトリーサプライ
	 *   'MSM1_P02': プレス金型用標準部品
	 *   'MSM1_K03': プラ型用標準部品
	 * - example: MSM1_09-101
	 * - NOTE: ・コード値はカタログ追加に応じて変更有り
	 */
	catalogCode?: string;
	/**
	 * 瞬索くんコード
	 * - 瞬索くんコードを指定
	 * - example: 10442
	 */
	shunsakuCode?: string;
	/**
	 * 選択項目
	 * - シリーズ絞込条件に指定するスペック項目コードおよびスペック値を指定
	 * - example: C1.M0101000000=a&D1.110302634310=10,20
	 * - NOTE: スペック項目コードをリクエストパラメータ名、
	 *         スペック値を値として指定。複数指定可。
	 * @type {string | string[]}
	 */
	[specCode: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	/**
	 * アイコンタイプ
	 * - 絞り込み条件のアイコン情報
	 *   1: 新商品
	 *   2: 脱脂洗浄
	 *   3: 規格拡大
	 *   4: 規格変更
	 *   5: 価格改定
	 *   6: 値下げ
	 *   7: 納期短縮
	 * - example: 4
	 * - NOTE: アイコンタイプでの絞込条件。カンマで区切ることで複数指定可。
	 */
	iconType?: string;
	/**
	 * RoHSフラグ
	 * - RoHS対応の絞り込み条件
	 *   0: 未対応
	 *   1: 対応
	 * - default: 1
	 * - example: 1
	 */
	rohsFlag?: Flag;
	/**
	 * 規格廃止品フラグ
	 * - 規格廃止品の絞り込み条件
	 *   0: 廃止品を含まない
	 *   1: 廃止品を含む
	 * - default: 0
	 * - NOTE: この機能を有効にするためには現法別制御ファイルにて機能の有効化が必要（discontinued:true）
	 */
	discontinuedProductFlag?: Flag;
	/**
	 * C-Valueフラグ
	 * - ブランド＝ミスミの場合のみ設定可能
	 */
	cValueFlag?: Flag;
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
	 * 出荷日数
	 * - シリーズ絞り込み条件の出荷日(?日以内)
	 * - example: 1,2,3
	 * - NOTE: 出荷日での絞込条件。カンマで区切ることで複数指定可。
	 */
	daysToShip?: number | number[];
	/**
	 * CADタイプ
	 * - シリーズ絞り込み条件のCADタイプ
	 *   1: 2D
	 *   2: 3D
	 * - example: 1
	 * - NOTE: CADでの絞込条件。カンマで区切ることで複数指定可。
	 */
	cadType?: string | string[];
	/**
	 * ソート順
	 * - ソート順の指定
	 *   1: 人気順(現行のおすすめ順)
	 *   2: 価格の安い順
	 *   3: 特集順
	 *   4: おすすめ順(FAで新たに追加されたソート順)
	 *   5: 出荷日の早い順
	 *   6: 内容量単価の安い順（別紙6）
	 *   7: 内容量単価の高い順（別紙6）
	 *   8: キーワード別クリック数多い順
	 *   9: キーワード別クリック数多い順+Solrスコア順
	 * - default: おすすめ順が定義されているカテゴリの場合は4、それ以外は1
	 * - example: 2
	 * - NOTE: 6: 内容量単価の安い順
	 *         　内容量単価 asc
	 *         　クリック数 desc（下記 8:参照）
	 *         　シリーズコード asc
	 *         7: 内容量単価の高い順
	 *         　内容量単価 desc
	 *         　クリック数 desc（下記 8:参照）
	 *         　シリーズコード asc
	 *         8: キーワード別クリック数多い順
	 *         　「キーワード：シリーズ：クリック数」という定義ファイルを入稿して頂く。
	 *         　検索条件にキーワードが指定されていた場合、上記クリック数の多い順で検索結果のシリーズを並び替える。
	 *         　制約：ページング内のみ並び替え可能
	 *         9: キーワード別クリック数+Solrスコア値(類似度)
	 *         　単一キーワード(空白を含まない)の場合は、sort=8と同様。
	 *         　複数キーワードが指定されていた場合、sort=8同様、クリック数の多い順で検索結果のシリーズを並び替える。
	 *         　クリック数が同一の場合は、Solr内部の類似度計算結果のスコア値の多い順で並び替える
	 *         　制約：ページング内のみ並び替え可能
	 */
	sort?: string;
	/**
	 * 内容量単価from
	 * - minLength: 0
	 * - example: 10.5
	 */
	pricePerPieceFrom?: number;
	/**
	 * 内容量単価to
	 * - minLength: 0
	 * - example: 1000.1
	 */
	pricePerPieceTo?: number;
	/**
	 * 全スペック返却フラグ
	 * - シリーズ絞り込み候補のスペックとして非表示のものも含めてすべて返却するかどうか
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
	/**
	 * ユニットタイプ
	 * - シリーズ絞り込み条件のユニットタイプ
	 *   1: メトリック
	 *   2: インチ
	 * - default: 30
	 * - example: 1
	 */
	unitType?: string;
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

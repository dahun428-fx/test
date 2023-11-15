import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';
import {
	Contact,
	DigitalBook,
	IconType,
	Msds,
	Pict,
	ProductImage,
	SeriesCadType,
	StandardSpecValue,
	TabType,
} from '@/models/api/msm/ect/series/shared';

/** シリーズ検索APIレスポンス */
export interface SearchSeriesResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索結果総件数(緊急非表示対応された件数を除く総件数)
	 * - example: 1000
	 * - field groups: @search
	 */
	totalCount: number;
	/**
	 * スペック項目リスト
	 * - 基本情報および仕様比較で使用するスペック項目のリスト
	 * - field groups: @search, @detail
	 * - NOTE: シリーズコードをリクエストした場合は基本情報、カテゴリコードをリクエストした場合は仕様比較で使用するスペック項目を返却する
	 */
	specList: Spec[];
	/**
	 * シリーズ情報リスト
	 * - 検索結果のシリーズ一覧
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	seriesList: Series[];
	/**
	 * メーカー上位表示フラグ
	 * - メーカーを上位に表示するフラグ
	 * - example: 0:通常, 1:上位表示
	 * - field groups: @search
	 */
	brandViewTopFlag: Flag;
	/**
	 * スペック検索表示タイプ
	 * - スペック検索ページのデフォルト表示タイプ
	 *   1: 一覧表示
	 *   2: 写真表示
	 *   3: 仕様比較表示
	 * - field groups: @search
	 */
	specSearchDispType?: string;
	/**
	 * ソート順指定フラグ
	 * - ソート順のプルダウンを指定するかどうか
	 *   0: 表示しない
	 *   1: 表示する
	 * - example: 1
	 * - field groups: @search
	 */
	specSortFlag?: Flag;
	/**
	 * ソート順リスト
	 * - ソート順のプルダウンに表示する項目のリスト
	 *   1: 人気順(現行のおすすめ順)
	 *   2: 価格の安い順
	 *   3: 特集順
	 *   4: おすすめ順(FAで新たに追加されたソート順)
	 *   5: 出荷日の早い順
	 * - example: ["4","1","2","5"]
	 * - field groups: @search
	 */
	sortList: string[];
	/**
	 * 在庫品情報
	 * - 在庫品情報
	 * - field groups: @search
	 * - NOTE: 別紙４参照
	 */
	stockItem: StockItem;
	/**
	 * 仕様・寸法リスト
	 * - 仕様・寸法で絞り込む
	 * - field groups: @search
	 */
	seriesSpecList: SeriesSpec[];
	/**
	 * グループ項目リスト
	 * - 並列で表示するスペック項目のリスト
	 * - field groups: @search
	 */
	groupSpecList: GroupSpec[];
	/**
	 * カテゴリリスト
	 * - カテゴリ絞り込みのスペック
	 * - field groups: @search
	 * - NOTE: 最大50件
	 */
	categoryList: Category[];
	/**
	 * ブランドリスト
	 * - メーカー絞り込みのスペック
	 * - field groups: @search
	 * - NOTE: シリーズ件数が多い順で返却
	 */
	brandList: Brand[];
	/**
	 * C-Value情報
	 * - C-Value情報
	 * - field groups: @search
	 */
	cValue: CValue;
	/**
	 * CADタイプリスト
	 * - CAD種別のリスト
	 * - example: 1
	 * - field groups: @search
	 */
	cadTypeList: CadType[];
	/**
	 * 出荷日数リスト
	 * - シリーズ絞り込み条件の出荷日(?日以内)
	 * - field groups: @search
	 * - NOTE: 出荷日数リストが空の場合は、出荷日を非表示とする。
	 */
	daysToShipList: DaysToShip[];
	/**
	 * ブランドモードフラグ
	 * - ブランドモードで検索が行われたかどうか
	 *   0: 通常モード
	 *   1: ブランドモード
	 * - field groups: @search
	 */
	brandModeFlag: Flag;
	/**
	 * ブランドモードキーワード
	 * - ブランドモード検索時に、検索に使用したキーワード
	 *   (入力されたキーワードからブランド名を除外した部分)
	 * - field groups: @search
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandModeKeyword?: string;
	/**
	 * ブランドモードブランド名
	 * - ブランドモード検索時に、検索に使用したブランド名称
	 * - example: ミスミ
	 * - field groups: @search
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandModeBrandName?: string;
	/**
	 * 「基本形状から選ぶ」情報
	 * - 「基本形状から選ぶ」を表示する際に必要な情報
	 * - field groups: @search
	 */
	basicShapeTemplateInfo?: BasicShapeTemplateInfo;
	/**
	 * 「仕様・規格から選ぶ(シャフトパターン)」情報
	 * - 「仕様・規格から選ぶ(シャフトパターン)」を表示する際に必要な情報
	 * - field groups: @search
	 */
	shaftPatternTemplateInfo?: ShaftPatternTemplateInfo;
	/**
	 * 通貨コード
	 * - 通貨コード
	 *   JPY: 日本円
	 *   RMB: 人民元
	 * - maxLength: 3
	 * - example: JPY
	 * - field groups: @search, @detail, @unit, @box
	 */
	currencyCode: string;
}

/** スペック項目 */
export interface Spec {
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - example: E01
	 * - field groups: @search, @detail
	 */
	specCode: string;
	/**
	 * 表示用スペックコード
	 * - 表示用のスペックコード
	 * - example: C3
	 * - field groups: @search, @detail
	 */
	specCodeDisp?: string;
	/**
	 * スペック項目名
	 * - スペック項目の名称
	 * - example: 材質
	 * - field groups: @search, @detail
	 * - NOTE: チェックマスタに存在するが新管理で登録されていない場合など、スペック名が取得できない場合は「その他選択」という名称を返却する
	 */
	specName: string;
	/**
	 * スペック項目単位
	 * - 数値の単位
	 * - example: mm
	 * - field groups: @search, @detail
	 */
	specUnit?: string;
	/**
	 * スペック項目タイプ
	 * - スペック項目のタイプ
	 *   1: C項目
	 *   2: D項目
	 *   3: E項目
	 * - field groups: @search, @detail
	 */
	specType: string;
}

/** シリーズ情報 */
export interface Series {
	/**
	 * 事業部コード
	 * - 事業部コード
	 *   mech: メカ
	 *   el: エレ
	 *   fs: FS
	 *   mold: 金型(モールド)
	 *   press: 金型(プレス)
	 * - example: mech
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	departmentCode: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - example: M0101000000
	 * - field groups: @default, @search, @detail, @unit, @box
	 * - NOTE: カテゴリに紐付かないシリーズの場合は返却しない
	 */
	categoryCode?: string;
	/**
	 * カテゴリ名
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 * - field groups: @default, @search, @detail, @unit, @box
	 * - NOTE: カテゴリに紐付かないシリーズの場合は返却しない
	 */
	categoryName?: string;
	/**
	 * 検索カテゴリコード
	 * - C項目が定義されているカテゴリのコード
	 * - example: M0101000000
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	searchCategoryCode?: string;
	/**
	 * グループタイプ
	 * - シリーズを分類するタイプ
	 *   1: ミスミ平歯車
	 *   2: ボックス
	 * - example: 1
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	groupType?: string;
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - example: 110300004660
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	seriesCode: string;
	/**
	 * シリーズ名
	 * - シリーズの名称
	 * - example: シャフト　全長表面処理
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	seriesName: string;
	/**
	 * ブランドコード
	 * - シリーズの所属するブランドコード
	 * - example: MSM
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	brandCode: string;
	/**
	 * ブランドURLコード
	 * - シリーズの所属するブランドのURL用のコード
	 * - example: misumi
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	brandUrlCode: string;
	/**
	 * ブランド名
	 * - シリーズの所属するブランド名称
	 * - example: ミスミ
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	brandName: string;
	/**
	 * シリーズ状態
	 * - シリーズの状態
	 *   1: 通常
	 *   2: 商品情報準備中
	 *   3: 規格廃止品
	 * - example: 1
	 * - field groups: @default, @search, @detail, @unit, @box
	 * - NOTE: 瞬索くんコードによる検索のときのみ、2, 3がセットされる。
	 *         通常検索では 1 のみがセットされるため、廃止品を判別する際は規格廃止品フラグを使用する。
	 */
	seriesStatus: string;
	/**
	 * 商品画面テンプレートタイプ
	 * - 商品詳細画面の画面テンプレートのタイプ
	 *   1: 通常テンプレート
	 *   2: 単純品テンプレート
	 *   3: Eカタログ未掲載テンプレート(生成パターンH)
	 *   4: WYSIWYG強調表示テンプレート
	 *   7: PU品用テンプレート
	 * - example: 1
	 * - field groups: @detail, @unit, @box
	 * - NOTE: 画面テンプレートの種類に応じてタイプの増減あり
	 */
	templateType: TemplateType;
	/**
	 * 商品分野
	 * - Webお問合せフォームの商品の分野に表示
	 *   1: メカニカル標準部品(ミスミ)
	 *   2: メカニカル加工部品(ミスミ)
	 *   3: メカニカル標準部品(ミスミ以外)
	 *   4: エレクトロニクス部品(ミスミ)
	 *   5: エレクトロニクス部品(ミスミ以外)
	 *   6: 工具・消耗品関連(ミスミ)
	 *   7: 工具・消耗品関連(ミスミ以外)
	 *   8: プレス金型部品
	 *   9: プラ型用部品(ミスミ)
	 * - example: 1
	 * - field groups: @detail, @unit, @box
	 */
	productField?: string;
	/**
	 * 商品画像リスト
	 * - シリーズの画像一覧
	 * - field groups: @default, @search, @detail, @unit, @box
	 * - NOTE: NASかScene7か識別するフラグが必要か否かは検討
	 */
	productImageList: ProductImage[];
	/**
	 * 基本形状画像URL
	 * - 「基本形状から選ぶ」で表示する基本形状画像のURL
	 * - field groups: @search, @detail, @unit, @box
	 */
	basicShapeImageUrl?: string;
	/**
	 * キャッチコピー
	 * - シリーズのキャッチコピー
	 * - example: 【特長】 軸端加工部にも表面処理が施されているシャフトです。
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	catchCopy?: string;
	/**
	 * 解説
	 * - 「仕様・規格表から選ぶ(シャフトパターン)」で表示する解説文言
	 * - field groups: @search
	 */
	description?: string;
	/**
	 * 最小パック品入数
	 * - パック品入数の最小値を返却
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	minPiecesPerPackage?: number;
	/**
	 * 最大パック品入数
	 * - パック品入数の最大値を返却
	 * - example: 500
	 * - field groups: @search, @detail, @unit, @box
	 */
	maxPiecesPerPackage?: number;
	/**
	 * 最小通常出荷日数
	 * - 通常出荷日数の最小値を返却
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 *   99: 別途調整、都度見積り
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日数
	 * - 通常出荷日数の最大値を返却
	 * - example: 5
	 * - field groups: @search, @detail, @unit, @box
	 */
	maxStandardDaysToShip?: number;
	/**
	 * 最小最短出荷日数
	 * - ストーク適用時の出荷日数の最小値を返却
	 * - field groups: @search, @detail, @unit, @box
	 */
	minShortestDaysToShip?: number;
	/**
	 * 最大最短出荷日数
	 * - ストーク適用時の出荷日数の最大値を返却
	 * - example: 3
	 * - field groups: @search, @detail, @unit, @box
	 */
	maxShortestDaysToShip?: number;
	/**
	 * 直接カート追加タイプ
	 * - 直接カート追加が可能かどうかを表すタイプ
	 *   1: 直接カート追加不可能
	 *   2: 直接カート追加可能
	 *   3: バリエーションから選ぶ(単純品かつ複数インナーの場合)
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 * - NOTE: カート追加権限の無いユーザ(未ログイン、EC会員)の場合でも2を返却する
	 */
	directCartType: string;
	/**
	 * 価格非表示フラグ
	 * - 価格表現自体を非表示にするシリーズを表すフラグ
	 *   0: 表示
	 *   1: 非表示
	 * - field groups: @search, @detail, @unit, @box
	 */
	priceHiddenFlag: Flag;
	/**
	 * 価格チェックレスフラグ
	 * - 価格チェックが不要なシリーズを表すフラグ
	 *   0: 必要
	 *   1: 不要
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	priceCheckLessFlag: Flag;
	/**
	 * 最小通常単価
	 * - 当該シリーズ内インナーの持つ最安の単価を返却
	 *   算出ロジックは別紙1を参照
	 * - example: 100
	 * - field groups: @search, @detail, @unit, @box
	 */
	minStandardUnitPrice?: number;
	/**
	 * 最大通常単価
	 * - 当該シリーズ内インナーの持つ最高の単価を返却
	 *   算出ロジックは別紙1を参照
	 * - example: 1000
	 * - field groups: @search, @detail, @unit, @box
	 */
	maxStandardUnitPrice?: number;
	/**
	 * 最小内容量単価
	 * - 当該シリーズ内インナーの持つ最安の内容量単価を返却
	 *   内容量単価＝通常単価/パック品入数
	 * - example: 100
	 * - field groups: @search, @detail, @unit, @box
	 */
	minPricePerPiece?: number;
	/**
	 * 最大内容量単価
	 * - 当該シリーズ内インナーの持つ最高の内容量単価を返却
	 *   内容量単価＝通常単価/パック品入数
	 * - example: 1000
	 * - field groups: @search, @detail, @unit, @box
	 */
	maxPricePerPiece?: number;
	/**
	 * 最小キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その最小価格を返却
	 *   特別価格の場合は値の設定はしない
	 * - example: 800
	 * - field groups: @search, @detail, @unit, @box
	 * - NOTE: セール価格項目が存在せず、セール日付のみ返却された場合は特別価格として扱う
	 */
	minCampaignUnitPrice?: number;
	/**
	 * 最大キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その最大価格を返却
	 *   特別価格の場合は値の設定はしない
	 * - example: 10000
	 * - field groups: @search, @detail, @unit, @box
	 * - NOTE: セール価格項目が存在せず、セール日付のみ返却された場合は特別価格として扱う
	 */
	maxCampaignUnitPrice?: number;
	/**
	 * キャンペーン終了日
	 * - キャンペーン値引きの日付が設定されている場合、その日付を返却
	 * - example: 42422
	 * - field groups: @search, @detail, @unit, @box
	 * - NOTE: yyyy/mm/dd
	 */
	campaignEndDate?: string;
	/**
	 * おすすめフラグ
	 * - おすすめフラグ
	 *   0: なし
	 *   1: あり
	 *   カテゴリ別シリーズ広告枠にシリーズコードが登録されている場合、１を返す
	 *   それ以外は０を返す
	 * - field groups: @search, @detail, @unit, @box
	 */
	recommendFlag: Flag;
	/**
	 * グレードタイプ
	 * - シリーズのグレード情報
	 *   1: エコノミー
	 *   2: クオリティプラス
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	gradeType?: string;
	/**
	 * グレードタイプ表示文言
	 * - シリーズのグレード情報の表示文言
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	gradeTypeDisp?: string;
	/**
	 * アイコンタイプリスト
	 * - アイコンタイプリスト
	 * - field groups: @search, @detail, @unit, @box
	 */
	iconTypeList?: IconType[];
	/**
	 * スライド値引き有りフラグ
	 * - スライド値引き有りフラグ
	 *   0: なし
	 *   1: あり
	 *   数量スライド割引※詳細は別紙１を参照
	 * - field groups: @search, @detail, @unit, @box
	 */
	volumeDiscountFlag: Flag;
	/**
	 * RoHS枠ありフラグ
	 * - RoHSの枠の有無
	 *   0: 枠なし
	 *   1: 枠あり
	 * - maxLength: 1
	 * - field groups: @detail, @unit
	 */
	rohsFrameFlag: Flag;
	/**
	 * 関連情報枠ありフラグ
	 * - 関連情報の枠の有無
	 *   0: 枠なし
	 *   1: 枠あり
	 * - maxLength: 1
	 * - field groups: @detail, @unit
	 */
	relatedLinkFrameFlag: Flag;
	/**
	 * C-Valueフラグ
	 * -   0: C-VALUEでない
	 *   1: C-VALUEである
	 * - field groups: @search, @detail, @unit, @box
	 */
	cValueFlag: Flag;
	/**
	 * 在庫品フラグ
	 * -   0: 在庫品でない
	 *   1: 在庫品である
	 * - maxLength: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	stockItemFlag: Flag;
	/**
	 * 標準価格表示フラグ
	 * - 標準価格表示フラグ
	 *   0: 表示しない
	 *   1: 表示する
	 * - example: 0
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	displayStandardPriceFlag: Flag;
	/**
	 * 規格廃止品フラグ
	 * - 規格廃止品フラグ
	 *   0: シリーズ配下に通常品を含む
	 *   1: シリーズ配下が全て規格廃止品
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	discontinuedProductFlag: Flag;
	/**
	 * ピクトリスト
	 * - ピクトのリスト
	 * - field groups: @search, @detail, @unit, @box
	 */
	pictList?: Pict[];
	/**
	 * CADタイプリスト
	 * - CADの種別
	 * - field groups: @search, @detail, @unit, @box
	 */
	cadTypeList: SeriesCadType[];
	/**
	 * ミスミブランド判別フラグ
	 * - ミスミ品かVONA品かの判定フラグ
	 *   0: VONA品
	 *   1: ミスミ品
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	misumiFlag: Flag;
	/**
	 * パック数量スペック項目有無フラグ
	 * - スペック項目にパック数量(E999)が含まれているかを表すフラグ
	 *   0: 含まない
	 *   1: 含む
	 * - field groups: @search, @detail, @unit, @box
	 */
	packageSpecFlag: Flag;
	/**
	 * 型番候補
	 * - 型番候補の文字列
	 * - example: SFJ3-[10-400/1]
	 * - field groups: @search, @detail, @unit, @box
	 */
	partNumber?: string;
	/**
	 * 商品ご注意案内文
	 * - 商品注意文のテキスト情報(薄黄色背景の文言)
	 * - example: PSE一部改正に伴う耐トラッキング性要求への【適合品に順次切替】を行います。
	 * - field groups: @detail, @unit, @box
	 * - NOTE: HTMLタグも含んだ文言をセット
	 */
	seriesInfoText?: string[];
	/**
	 * 商品注意喚起文
	 * - 注意喚起文のテキスト情報(商品詳細ページ下部)
	 * - example: 選定の際は、THK テクニカルサポートサイトも合わせてご参照下さい
	 * - field groups: @detail, @unit, @box
	 * - NOTE: HTMLタグも含んだ文言をセット
	 */
	seriesNoticeText?: string;
	/**
	 * PDF注意喚起文
	 * - PDFの注意喚起文
	 * - example: 日本語のみ
	 * - field groups: @detail, @unit, @box
	 */
	pdfNoticeText?: string;
	/**
	 * デジタルブックPDFURL
	 * - PDFリンク表示のためのURL
	 * - example: //ドメイン名/book/THK1_04/digitalcatalog.html?page_num=A1-178
	 * - field groups: @detail, @unit, @box
	 */
	digitalBookPdfUrl?: string;
	/**
	 * 外部PDFURL
	 * - 外部PDF表示のためのURL
	 * - example: //dl.mitsubishielectric.co.jp/dl/fa/document/catalog/plc_fx/c-013/c-013-a.pdf#page=8
	 * - field groups: @detail, @unit, @box
	 */
	externalPdfUrl?: string;
	/**
	 * デジタルブック注意喚起文
	 * - デジタルブックの注意喚起文
	 * - example: ※複数軸タイプをご注文いただく場合、ご注文数は必要軸数の倍数でご入力ください。 （例）必要軸数2（-Ⅱ）⇒ご注文数は「2、4、6…」
	 * - field groups: @detail, @unit, @box
	 */
	digitalBookNoticeText?: string;
	/**
	 * デジタルブックリスト
	 * - field groups: @detail, @unit, @box
	 */
	digitalBookList?: DigitalBook[];
	/**
	 * チャット対応フラグ
	 * - チャット対応
	 *   0: チャット未対応
	 *   1: チャット対応
	 * - field groups: @detail, @box
	 */
	chatFlag: Flag;
	/**
	 * 類似品検索表示フラグ
	 * - 類似品検索ボタンを表示するかどうかを表すフラグ
	 *   0: 表示しない
	 *   1: 表示する
	 * - field groups: @detail
	 */
	similarSearchFlag: Flag;
	/**
	 * CAD ダウンロードボタンタイプ
	 * - CADダウンロードボタンの表示タイプ
	 *   1: 表示する
	 *   2: 表示する(準備中、押下不可)
	 *   3: 表示しない
	 * - field groups: @detail, @unit
	 */
	cadDownloadButtonType: CadDownloadButtonType;
	/**
	 * CAD 3Dプレビュー有無フラグ
	 * - 3Dプレビューの有無を表すフラグ
	 *   0: 無し
	 *   1: 有り
	 * - example: 1
	 * - field groups: @detail, @unit
	 */
	cad3DPreviewFlag: Flag;
	/**
	 * タブ表示タイプ
	 * - 商品詳細画面のタブの表示パターン
	 *   1: メカAパターン
	 *   2: メカBパターン
	 *   3: エレAパターン
	 *   4: エレBパターン(現状存在しない)
	 *   5: プレス・モールドAパターン
	 *   6: プレス・モールドBパターン
	 *   7: ツール(FS)Aパターン
	 *   8: ツール(FS)Bパターン
	 *   9: VONAパターン
	 *   10: PU品パターン
	 * - example: 1
	 * - field groups: @detail
	 * - NOTE: Bパターンの場合、複数のタブを結合して表示する。結合するタブは事業部によって異なる。
	 *         メカ：外形図・規格表タブ(商品説明+規格表+追加工)
	 *         プレス・モールド：外形図・規格表タブ(商品説明+規格表)
	 *         ツール(FS)：規格・納期タブ(商品説明+規格表+追加工)
	 */
	tabType: TabType;
	/**
	 * 商品説明html
	 * - field groups: @detail
	 * - NOTE: VONA品の商品説明htmlもこの項目で返却する
	 */
	productDescriptionHtml?: string;
	/**
	 * 規格表html
	 * - field groups: @detail
	 */
	specificationsHtml?: string;
	/**
	 * 価格表html
	 * - field groups: @detail
	 */
	priceListHtml?: string;
	/**
	 * 納期html
	 * - 該当するデータがECMのテーブルに存在しない
	 * - field groups: @detail
	 */
	daysToShipHtml?: string;
	/**
	 * 追加工html
	 * - field groups: @detail
	 */
	alterationHtml?: string;
	/**
	 * 概要・仕様html
	 * - field groups: @detail
	 */
	overviewHtml?: string;
	/**
	 * 使用例html
	 * - field groups: @detail
	 */
	exampleHtml?: string;
	/**
	 * 汎用html
	 * - field groups: @detail
	 */
	generalHtml?: string;
	/**
	 * 基本仕様html
	 * - field groups: @detail
	 */
	standardSpecHtml?: string;
	/**
	 * 技術データURL
	 * - field groups: @detail, @unit, @box
	 */
	technicalInfoUrl?: string;
	/**
	 * 単純品フラグ
	 * - 単純品フラグ
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	simpleFlag: Flag;
	/**
	 * ページビュー
	 * - 期間中のページビュー
	 * - field groups: @search
	 */
	pageView?: number;
	/**
	 * キーワード別シリーズクリック数
	 * - キーワード毎にシリーズがクリックされた数
	 * - example: 12
	 * - field groups: @search
	 * - NOTE: B面のみで返却
	 */
	keywordClickCount?: number;
	/**
	 * 検索類似度スコア
	 * - 検索エンジンの類似度スコア値
	 * - example: 0.9
	 * - field groups: @search
	 * - NOTE: B面のみで返却
	 */
	similarityScore?: number;
	/**
	 * 基本情報スペック値リスト
	 * - 基本情報のスペック値のリスト
	 * - field groups: @detail, @unit
	 */
	standardSpecValueList: StandardSpecValue[];
	/**
	 * 仕様比較スペック値リスト
	 * - 仕様比較のスペック値のリスト
	 * - field groups: @search
	 */
	comparisonSpecValueList: ComparisonSpecValue[];
	/**
	 * シャフトパターンスペック値リスト
	 * - 仕様・規格表から選ぶ(シャフトパターン)のスペック値のリスト
	 * - field groups: @search
	 * - NOTE: スペックグループで指定されているスペックのみ含まれる
	 */
	shaftPatternSpecValueList?: string;
	/**
	 * カテゴリ情報リスト
	 * - トップから親カテゴリまでのカテゴリ情報のリスト
	 *   上位から下位のカテゴリにソートされた状態で返却
	 * - field groups: @search, @detail, @unit, @box
	 */
	categoryList: CategoryInfo[];
	/**
	 * 問い合わせ先情報
	 * - 問い合わせ先情報
	 * - field groups: @search, @detail, @unit, @box
	 */
	contact: Contact;
	/**
	 * MSDSリスト
	 * - MSDSのリスト
	 * - field groups: @detail, @unit, @box
	 */
	msdsList: Msds[];
	/**
	 * 価格チェックログイン必須フラグ
	 * - 価格チェックにログイン必須かどうか
	 *   1:ログイン必須
	 *   0:ログイン必須ではない
	 * - example: 1
	 * - field groups: @detail, @unit, @box
	 * - NOTE: M_MI_PRICE_CHECK_LOGIN_SERIESテーブルに、シリーズコードのレコードがあれば"1"、なければ"0"
	 */
	priceCheckLoginFlag?: Flag;
	/**
	 * 検索デバッグ情報
	 * - 検索時の内部処理の内容を表す文字列
	 * - example: SC=110302634310|SN,SV|PV=100|RO=5
	 * - field groups: @default, @search, @detail, @unit, @box
	 * - NOTE: SC: シリーズコード
	 *         SN: シリーズ名称にヒット
	 *         SV: スペック選択肢にヒット
	 *         MT: メタタグにヒット
	 *         PV: ページビュー数
	 *         RO: おすすめ順の順位
	 */
	searchDebugInfo?: string;
	/**
	 * ユニットコード(仮)リスト
	 * - コンベヤの部材品を特定するためのユニットコード。
	 *   統合インナーコードを利用。
	 * - maxLength: 14
	 * - example: MDM00001066213
	 * - field groups: @detail, @unit
	 */
	unitCodeList?: string[];
	/**
	 * 即納配送可フラグ
	 * - 即納対応可能かどうか(中国のみ)
	 *   0: 非対応
	 *   1: 対応
	 * - example: 1
	 * - field groups: @detail, @unit, @box
	 */
	promptDeliveryFlag?: Flag;
	/**
	 * メタタグリスト
	 * - マスタ情報のメタタグ項目
	 * - example: ["熱可塑性エラストマー","パイプ 固定具","パイプクランプ(ゴムライナー付","ゴムライナー","パイプバンド","パイプ  クランプ"]
	 */
	metatagList?: string[];
	/**
	 * レビュー評価平均点数
	 * - レビューサマリ情報の評価平均点数
	 * - example: 4.6
	 * - field groups: @default, @search, @detail, @unit
	 */
	reviewAverageRate?: string;
	/**
	 * 特別配送料有フラグ
	 * - 特別配送料の対象商品かどうか
	 *   0：特別配送料対象外
	 *   1：特別配送料対象
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	specialShipmentFlag?: Flag;
}

/** 仕様比較スペック値 */
export interface ComparisonSpecValue {
	/**
	 * スペック項目コード
	 * - 仕様比較のスペック項目コード
	 * - field groups: @search
	 */
	specCode?: string;
	/**
	 * スペック値
	 * - 仕様比較のスペック値(コード or 値)
	 * - field groups: @search
	 * - NOTE: 複数の場合、表示文言と同様に" / "もしくは" ～ "で区切ってスペック値を返却
	 */
	specValue?: string;
	/**
	 * スペック値表示文言
	 * - 仕様比較のスペック値の表示文言
	 * - field groups: @search
	 */
	specValueDisp?: string;
}

/** カテゴリ情報 */
export interface CategoryInfo {
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - field groups: @search, @detail, @unit, @box
	 */
	categoryCode: string;
	/**
	 * カテゴリ名
	 * - カテゴリ名
	 * - field groups: @search, @detail, @unit, @box
	 */
	categoryName: string;
	/**
	 * 規格廃止品フラグ
	 * - 規格廃止品フラグ
	 *   0: カテゴリ配下に通常品を含む
	 *   1: カテゴリ配下が全て規格廃止品
	 * - field groups: @search, @detail, @unit
	 * - NOTE: フロント側で配下が全て廃止のシリーズにはパンくずのリンクをつけないようにし、意図せず何も買えないページ（廃止品だけの検索結果）に飛ばないようにするために使用
	 */
	discontinuedProductFlag: Flag;
}

/** 在庫品情報 */
export interface StockItem {
	/**
	 * 在庫品フラグ
	 * - 在庫品対象の指定
	 *   0: 指定しない
	 *   1: 指定する
	 * - field groups: @search
	 * - NOTE: 現在の条件に該当する在庫品が１件でもあれば"1"、無ければ"0"
	 */
	stockItemFlag: Flag;
	/**
	 * シリーズ件数
	 * - 指定した検索条件に一致するシリーズのうち、在庫品の件数
	 * - example: 10
	 * - field groups: @search
	 */
	seriesCount: number;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 * - NOTE: 現在の条件に該当する在庫品が１件でもあれば"0"、無ければ"1"
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 * - NOTE: リクエストの内容に応じて返却
	 */
	selectedFlag: Flag;
}

/** 仕様・寸法 */
export interface SeriesSpec {
	/**
	 * スペック項目コード
	 * - スペック項目のコード値
	 * - example: E01
	 * - field groups: @search
	 * - NOTE: インチ・メトリックのスペック項目コード: unitType
	 */
	specCode: string;
	/**
	 * スペック項目名
	 * - スペック項目の名前
	 * - example: 形状
	 * - field groups: @search
	 */
	specName: string;
	/**
	 * スペック項目単位
	 * - スペック項目の単位
	 * - example: mm
	 * - field groups: @search
	 */
	specUnit?: string;
	/**
	 * スペック項目表示タイプ
	 * - スペックの表示種別
	 *   1: テキストボタン形式
	 *   2: テキスト選択形式（1列）
	 *   3: テキスト選択形式（2列）
	 *   4: テキスト選択形式（3列）、
	 *   5: 画像ボタン形式（1列）
	 *   6: 画像ボタン形式（2列）
	 *   7: 画像ボタン形式（3列）
	 *   8: 数値入力形式
	 *   9: リスト選択形式
	 *   11: 数値集約形式
	 *   12: 中央表示
	 * - example: 1
	 * - field groups: @search
	 * - NOTE: シリーズ検索APIでは
	 *          10: ツリー(入れ子)選択形式は返却しない、
	 *         タイプは「3:テキスト選択形式 (2列)」として返却
	 *         シリーズ検索APIでは
	 *         13～21の表示タイプは返却しない、
	 *         該当するタイプは通常テンプレート向けに読み替える。
	 *         （詳しい内容は別紙５参照）
	 */
	specViewType: SpecViewType;
	/**
	 * 補足表示タイプ
	 * - スペックの補足表示種別
	 *   1: 通常
	 *   2: 外形図
	 *   3: 詳細
	 *   4: 拡大
	 *   5: イラスト
	 * - example: 2
	 * - field groups: @search
	 * - NOTE: 4,5の場合はスペック値画像URLの画像を用いる
	 */
	supplementType: string;
	/**
	 * 外形図画像URL
	 * - 外形図ダイアログで表示する画像のURL
	 * - example: //xxx/illustration/press/P010105_C3_F.png
	 * - field groups: @search
	 */
	specImageUrl?: string;
	/**
	 * スペック説明画像URL
	 * - スペックの説明画像のURL
	 * - field groups: @search
	 */
	specDescriptionImageUrl?: string;
	/**
	 * 詳細HTML
	 * - 詳細ダイアログで表示するHTML
	 * - field groups: @search
	 */
	detailHtml?: string;
	/**
	 * 開閉タイプ
	 * - スペック表示の開閉状態
	 *   1: 開く
	 *   2: 閉じる
	 *   3: 開閉ボタン非表示
	 * - example: 1
	 * - field groups: @search
	 */
	openCloseType: OpenCloseType;
	/**
	 * スペック注意喚起文
	 * - スペックの注意文言
	 * - example: 各メーカーの精度基準をご確認下さい
	 * - field groups: @search
	 */
	specNoticeText?: string;
	/**
	 * 数値入力項目
	 * - 数値入力項目
	 * - field groups: @search
	 */
	numericSpec?: NumericSpec;
	/**
	 * スペック値リスト
	 * - スペック値のリスト
	 * - field groups: @search
	 * - NOTE: リスト内のすべてのスペック値が非表示の場合は、リスト(ボタン)を非表示
	 */
	specValueList: SpecValue[];
	/**
	 * 表示順
	 * - スペック項目の表示順
	 * - example: 1
	 */
	displayOrder: number;
}

/** 数値入力項目 */
export interface NumericSpec {
	/**
	 * 非表示フラグ
	 * - 数値入力項目を表示するかどうか
	 *   0: 表示する
	 *   1: 表示しない
	 * - field groups: @search
	 * - NOTE: そもそも数値入力欄が存在しない場合は、「数値入力項目」自体を返却しない
	 */
	hiddenFlag: Flag;
	/**
	 * スペック値
	 * - 数値入力形式のテキストフィールドに表示する値(リクエスト値)
	 * - example: 100
	 * - field groups: @search
	 */
	specValue?: string;
	/**
	 * 数値範囲リスト
	 * - 数値範囲のリスト
	 * - field groups: @search
	 */
	specValueRangeList: SpecValueRange[];
}

/** 数値範囲 */
export interface SpecValueRange {
	/**
	 * 最小値
	 * - 指定可能な最小値
	 * - example: 1.0
	 * - field groups: @search
	 */
	minValue?: number;
	/**
	 * 最大値
	 * - 指定可能な最大値
	 * - example: 9.5
	 * - field groups: @search
	 */
	maxValue?: number;
	/**
	 * 刻み値
	 * - 値の刻み幅
	 * - example: 0.5
	 * - field groups: @search
	 */
	stepValue?: number;
}

/** スペック値 */
export interface SpecValue {
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値)
	 * - example: 100
	 * - field groups: @search
	 * - NOTE: インチ・メトリックのスペック値コード:
	 *         　1: metric
	 *           2: inch
	 */
	specValue: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言
	 * - example: 加工なし
	 * - field groups: @search
	 * - NOTE: インチ・メトリックのスペック値表示文言:
	 *         　1: metric
	 *           2: inch
	 */
	specValueDisp: string;
	/**
	 * スペック値画像URL
	 * - スペック値の画像URL
	 * - example: //xxx/PHOTO/10302634310.jpg
	 * - field groups: @search
	 */
	specValueImageUrl?: string;
	/**
	 * 非表示フラグ
	 * - このスペック値を表示するかどうか
	 *   0: 表示
	 *   1: 非表示
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みのスペック値の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
	/**
	 * 子スペック値リスト
	 * - 2段表示のスペック値リスト
	 * - field groups: @search
	 * - NOTE: スペック値タイプが2,3のときのみ、値がセットされる
	 */
	childSpecValueList: ChildSpecValue[];
}

export interface ChildSpecValue {
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値)
	 * - example: 1
	 * - field groups: @search
	 */
	specValue: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言
	 * - example: 鉄
	 * - field groups: @search
	 */
	specValueDisp: string;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みのスペック値の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** グループ項目 */
export interface GroupSpec {
	/**
	 * グループ項目名
	 * - 項目名
	 * - field groups: @search
	 */
	groupSpecName?: string;
	/**
	 * グループ注意喚起文
	 * - 注意喚起文
	 * - field groups: @search
	 */
	groupSpecNoticeText?: string;
	/**
	 * 左側スペック項目コード
	 * - 左側に表示するスペック項目のコード
	 * - field groups: @search
	 */
	leftSpecCode?: string;
	/**
	 * 右側スペック項目コード
	 * - 右側に表示するスペック項目のコード
	 * - field groups: @search
	 */
	rightSpecCode?: string;
}

/** カテゴリ */
export interface Category {
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - example: M0101000000
	 * - field groups: @search
	 */
	categoryCode: string;
	/**
	 * カテゴリ名
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 * - field groups: @search
	 */
	categoryName: string;
	/**
	 * シリーズ件数
	 * - 指定した検索条件に一致するシリーズのうち、このブランドに属する件数
	 * - example: 10
	 * - field groups: @search
	 */
	seriesCount: number;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** ブランド */
export interface Brand {
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: THK1
	 * - field groups: @search
	 */
	brandCode: string;
	/**
	 * ブランドURLコード
	 * - ブランドURLコード(登録されている場合のみ)
	 * - field groups: @search
	 */
	brandUrlCode?: string;
	/**
	 * ブランド名
	 * - ブランド名
	 * - example: THK
	 * - field groups: @search
	 */
	brandName: string;
	/**
	 * シリーズ件数
	 * - 指定した検索条件に一致するシリーズのうち、このブランドに属する件数
	 * - example: 10
	 * - field groups: @search
	 */
	seriesCount: number;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** C-Value情報 */
export interface CValue {
	/**
	 * C-Valueフラグ
	 * - C-Value対象の指定(ミスミ品の場合)
	 *   0: C-valueなし
	 *   1: C-valueあり
	 * - field groups: @search
	 */
	cValueFlag: Flag;
	/**
	 * シリーズ件数
	 * - 指定した検索条件に一致するシリーズのうち、C-Valueの件数
	 * - example: 10
	 * - field groups: @search
	 */
	seriesCount: number;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** CADタイプ */
export interface CadType {
	/**
	 * CADタイプ
	 * - シリーズ絞り込み条件のCADタイプ
	 *   1: 2D
	 *   2: 3D
	 * - example: 1
	 * - field groups: @search
	 */
	cadType: string;
	/**
	 * CADタイプ表示文言
	 * - シリーズ絞り込み条件のCADタイプの表示文言
	 * - example: 1
	 * - field groups: @search
	 */
	cadTypeDisp: string;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** 出荷日数 */
export interface DaysToShip {
	/**
	 * 出荷日数
	 * - 出荷までの実働日数
	 *   -1: 即納
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 *   99: 別途調整、都度見積り
	 * - maxLength: 3
	 * - example: 1
	 * - field groups: @search
	 */
	daysToShip: number;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** 「基本形状から選ぶ」情報 */
export interface BasicShapeTemplateInfo {
	/**
	 * 表示スペック数
	 * - 先頭から何行目までのスペックを初期表示するか
	 * - example: 3
	 * - field groups: @search
	 */
	showSpecCount?: number;
	/**
	 * スペック項目コードリスト
	 * - 表示するスペック項目コードのリスト
	 *   スペック以外の項目については、以下の値を返却
	 *   brand: メーカー
	 *   cad: CADx
	 *   unitPrice: 通常価格
	 *   daysToShip: 通常出荷日
	 *   specifications: 規格・仕様一覧
	 *   catchCopy: キャッチコピー
	 * - example: 00000042718
	 * - field groups: @search
	 */
	specCodeList?: string[];
}

/** 「仕様・規格から選ぶ(シャフトパターン)」情報 */
export interface ShaftPatternTemplateInfo {
	/**
	 * スペック項目コードリスト
	 * - 表示するスペック項目コードのリスト
	 *   スペック以外の項目については、以下の値を返却
	 *   brand: メーカー
	 *   cad: CAD
	 *   unitPrice: 通常価格
	 *   daysToShip: 通常出荷日
	 *   specifications: 規格・仕様一覧
	 *   catchCopy: キャッチコピー
	 *   image: 商品画像
	 *   descriptioin: 解説
	 *   スペックグループコード
	 * - example: ["00000042718","image","brand","SG123"]
	 * - field groups: @search
	 */
	specCodeList?: string[];
	/**
	 * スペックグループリスト
	 * - 「仕様・規格から選ぶ(シャフトパターン)」で通常のスペックの右側に表示するスペックグループのリスト
	 * - field groups: @search
	 */
	specGroupList?: SpecGroup[];
}

/** スペックグループ */
export interface SpecGroup {
	/**
	 * スペックグループコード
	 * - スペックグループのコード
	 * - example: SG123
	 * - field groups: @search
	 * - NOTE: スペック項目コードと重複しないようにするため、先頭を"SG"から始まる文字列とする
	 */
	specGroupCode?: string;
	/**
	 * スペックグループ名
	 * - スペックグループの名前
	 * - example: 追加工
	 * - field groups: @search
	 */
	specGroupName?: string;
	/**
	 * スペック項目リスト
	 * - スペックグループに属するスペックのリスト
	 * - field groups: @search
	 */
	specList?: SpecGroupSpec[];
}

/**
 * スペック項目
 *
 * NOTE: スペックグループに属するスペック
 */
export interface SpecGroupSpec {
	/**
	 * スペック項目コード
	 * - スペック項目コード
	 * - example: 12
	 * - field groups: @search
	 */
	specCode?: string;
	/**
	 * スペック項目名
	 * - スペック項目名
	 * - example: V溝
	 * - field groups: @search
	 */
	specName?: string;
	/**
	 * スペック項目型
	 * - スペックの型
	 *   Boolean: 真偽値
	 *   String: 文字列
	 * - example: Boolean
	 * - field groups: @search
	 */
	specType?: string;
	/**
	 * スペック説明画像URL
	 * - スペックの説明画像のURL
	 * - field groups: @search
	 */
	specDescriptionImageUrl?: string;
}

const CadDownloadButtonType = {
	ON: '1',
	PRE_ON: '2',
	OFF: '3',
} as const;

type CadDownloadButtonType =
	typeof CadDownloadButtonType[keyof typeof CadDownloadButtonType];

export { CadDownloadButtonType };

/**
 * 1: テキストボタン形式
 * 2: テキスト選択形式（1列）
 * 3: テキスト選択形式（2列）
 * 4: テキスト選択形式（3列）、
 * 5: 画像ボタン形式（1列）
 * 6: 画像ボタン形式（2列）
 * 7: 画像ボタン形式（3列）
 * 8: 数値入力形式
 * 9: リスト選択形式
 * 11: 数値集約形式
 * 12: 中央表示
 */
export const SpecViewType = {
	TEXT_BUTTON: '1',
	TEXT_SINGLE_LINE: '2',
	TEXT_DOUBLE_LINE: '3',
	TEXT_TRIPLE_LINE: '4',
	IMAGE_SINGLE_LINE: '5',
	IMAGE_DOUBLE_LINE: '6',
	IMAGE_TRIPLE_LINE: '7',
	NUMERIC: '8',
	LIST: '9',
	TREE: '10',
	AGGREGATION: '11',
	CENTER: '12',
} as const;
export type SpecViewType = typeof SpecViewType[keyof typeof SpecViewType];

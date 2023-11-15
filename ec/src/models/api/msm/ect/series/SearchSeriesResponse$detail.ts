import { Flag } from '@/models/api/Flag';
import type { TemplateType } from '@/models/api/constants/TemplateType';
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
export interface SearchSeriesResponse$detail extends MsmApiResponse {
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
	 * 基本情報スペック値リスト
	 * - 基本情報のスペック値のリスト
	 * - field groups: @detail, @unit
	 */
	standardSpecValueList: StandardSpecValue[];
	/**
	 * カテゴリ情報リスト
	 * - トップから親カテゴリまでのカテゴリ情報のリスト
	 *   上位から下位のカテゴリにソートされた状態で返却
	 * - field groups: @search, @detail, @unit, @box
	 */
	categoryList: Category[];
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

/** カテゴリ情報 */
export interface Category {
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

/**
 * CAD ダウンロードボタンタイプ
 *   1: 表示する
 *   2: 表示する(準備中、押下不可)
 *   3: 表示しない
 */
const CadDownloadButtonType = {
	ON: '1',
	PRE_ON: '2',
	OFF: '3',
} as const;

type CadDownloadButtonType =
	typeof CadDownloadButtonType[keyof typeof CadDownloadButtonType];

export { CadDownloadButtonType };

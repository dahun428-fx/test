import { Flag } from '@/models/api/Flag';
import { CadType as CadTypeEnum } from '@/models/api/constants/CadType';
import { IconType as IconTypeEnum } from '@/models/api/constants/IconType';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** タイプ検索APIレスポンス */
export interface SearchTypeResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索結果総件数(緊急非表示対応された件数を除く総件数)
	 * - example: 1000
	 */
	totalCount: number;
	/**
	 * シリーズ情報リスト
	 * - 検索結果のシリーズ一覧
	 */
	seriesList: Series[];
	/**
	 * 通貨コード
	 * - 通貨コード
	 *   JPY: 日本円
	 *   RMB: 人民元
	 * - maxLength: 3
	 * - example: JPY
	 */
	currencyCode: string;
	/**
	 * 検索キーワード補正フラグ
	 * - 入力文字列が変換されて検索が実行されたかを表すフラグ
	 *   0: 補正なし
	 *   1: 補正あり
	 * - example: 0
	 * - NOTE: 内部で検索処理を実行する前に、リクエストされたキーワードを補正したかどうかを返します。
	 *         ・リクエストキーワード≠補正キーワードが１つでも存在する場合に１を返却します。
	 */
	normalizeFlag: Flag;
	/**
	 * 検索キーワード変換フラグ
	 * - 入力文字列が変換されて検索が実行されたかを表すフラグ
	 *   0: 補正なし
	 *   1: 補正あり
	 * - example: 0
	 * - NOTE: 内部で検索処理を実行する前に、リクエストされたキーワードを変換したかどうかを返します。
	 *         ・補正キーワード≠検索キーワードが１つでも存在する場合に１を返却します。
	 */
	convertFlag: Flag;
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
	 */
	departmentCode: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - example: M0101000000
	 * - NOTE: カテゴリに紐付かないシリーズの場合は返却しない
	 */
	categoryCode?: string;
	/**
	 * カテゴリ名
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 * - NOTE: カテゴリに紐付かないシリーズの場合は返却しない
	 */
	categoryName?: string;
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - example: 110300004660
	 */
	seriesCode: string;
	/**
	 * シリーズ名
	 * - シリーズの名称
	 * - example: シャフト　全長表面処理
	 */
	seriesName: string;
	/**
	 * ブランドコード
	 * - シリーズの所属するブランドコード
	 * - example: MSM
	 */
	brandCode: string;
	/**
	 * ブランドURLコード
	 * - シリーズの所属するブランドのURL用のコード
	 * - example: misumi
	 */
	brandUrlCode: string;
	/**
	 * ブランド名
	 * - シリーズの所属するブランド名称
	 * - example: ミスミ
	 */
	brandName: string;
	/**
	 * シリーズ状態
	 * - シリーズの状態
	 *   1: 通常
	 *   2: 商品情報未掲載
	 *   3: 規格廃止品
	 * - example: 1
	 * - NOTE:
	 */
	seriesStatus: SeriesStatus;
	/**
	 * 商品画像リスト
	 * - シリーズの画像一覧
	 * - NOTE: NASかScene7か識別するフラグが必要か否かは検討
	 */
	productImageList: ProductImage[];
	/**
	 * キャッチコピー
	 * - シリーズのキャッチコピー
	 * - example: 【特長】 軸端加工部にも表面処理が施されているシャフトです。
	 */
	catchCopy: string;
	/**
	 * 最小パック品入数
	 * - パック品入数の最小値を返却
	 * - example: 1
	 */
	minPiecesPerPackage?: number;
	/**
	 * 最大パック品入数
	 * - パック品入数の最大値を返却
	 * - example: 500
	 */
	maxPiecesPerPackage?: number;
	/**
	 * 最小通常出荷日数
	 * - 通常出荷日数の最小値を返却
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 *   99: 別途調整、都度見積り
	 * - example: 1
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日数
	 * - 通常出荷日数の最大値を返却
	 * - example: 5
	 */
	maxStandardDaysToShip?: number;
	/**
	 * 最小最短出荷日数
	 * - ストーク適用時の出荷日数の最小値を返却
	 * - example: 0
	 */
	minShortestDaysToShip?: number;
	/**
	 * 最大最短出荷日数
	 * - ストーク適用時の出荷日数の最大値を返却
	 * - example: 3
	 */
	maxShortestDaysToShip?: number;
	/**
	 * 直接カート追加タイプ
	 * - 直接カート追加が可能かどうかを表すタイプ
	 *   1: 直接カート追加不可能
	 *   2: 直接カート追加可能
	 *   3: バリエーションから選ぶ(単純品かつ複数インナーの場合)
	 * - example: 1
	 * - NOTE: カート追加権限の無いユーザ(未ログイン、EC会員)の場合は2は返却しない
	 */
	directCartType: string;
	/**
	 * 価格チェックレスフラグ
	 * - 価格チェックが不要なシリーズを表すフラグ
	 *   0: 必要
	 *   1: 不要
	 * - example: 1
	 */
	priceCheckLessFlag: Flag;
	/**
	 * 最小通常単価
	 * - 当該シリーズ内インナーの持つ最安の単価を返却
	 *   算出ロジックは別紙1を参照
	 * - example: 100
	 */
	minStandardUnitPrice?: number;
	/**
	 * 最大通常単価
	 * - 当該シリーズ内インナーの持つ最高の単価を返却
	 *   算出ロジックは別紙1を参照
	 * - example: 1000
	 */
	maxStandardUnitPrice?: number;
	/**
	 * 最小内容量単価
	 * - 当該シリーズ内インナーの持つ最安の単価を返却
	 *   内容量単価＝通常単価/パック品入数
	 * - example: 100
	 */
	minPricePerPiece?: number;
	/**
	 * 最大内容量単価
	 * - 当該シリーズ内インナーの持つ最高の単価を返却
	 *   内容量単価＝通常単価/パック品入数
	 * - example: 1000
	 */
	maxPricePerPiece?: number;
	/**
	 * 最小キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その最小価格を返却
	 *   特別価格の場合は値の設定はしない
	 * - example: 800
	 * - NOTE: セール価格項目が存在せず、セール日付のみ返却された場合は特別価格として扱う
	 */
	minCampaignUnitPrice?: number;
	/**
	 * 最大キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その最大価格を返却
	 *   特別価格の場合は値の設定はしない
	 * - example: 10000
	 * - NOTE: セール価格項目が存在せず、セール日付のみ返却された場合は特別価格として扱う
	 */
	maxCampaignUnitPrice?: number;
	/**
	 * キャンペーン終了日
	 * - キャンペーン値引きの日付が設定されている場合、その日付を返却
	 * - example: 2016/2/22
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
	 * - example: 0
	 */
	recommendFlag: Flag;
	/**
	 * グレードタイプ
	 * - シリーズのグレード情報
	 *   1: エコノミー
	 *   2: クオリティプラス
	 * - example: 1
	 */
	gradeType?: string;
	/**
	 * グレードタイプ表示文言
	 * - シリーズのグレード情報の表示文言
	 * - example: 1
	 */
	gradeTypeDisp?: string;
	/**
	 * アイコンタイプリスト
	 * - アイコンタイプリスト
	 */
	iconTypeList?: IconType[];
	/**
	 * スライド値引き有りフラグ
	 * - スライド値引き有りフラグ
	 *   0: なし
	 *   1: あり
	 *   数量スライド割引※詳細は別紙１を参照
	 * - example: 0
	 */
	volumeDiscountFlag: Flag;
	/**
	 * C-Valueフラグ
	 * - 0: C-VALUEでない
	 *   1: C-VALUEである
	 * - example: 0
	 */
	cValueFlag: Flag;
	/**
	 * 在庫品フラグ
	 * - 0: 在庫品でない
	 *   1: 在庫品である
	 * - example: 1
	 */
	stockItemFlag: Flag;
	/**
	 * ピクトリスト
	 * - ピクトのリスト
	 */
	pictList?: Pict[];
	/**
	 * CADタイプリスト
	 * - CADの種別
	 */
	cadTypeList: CadType[];
	/**
	 * ミスミブランド判別フラグ
	 * - ミスミ品かVONA品かの判定フラグ
	 *   0: VONA品
	 *   1: ミスミ品
	 * - example: 1
	 */
	misumiFlag: Flag;
	/**
	 * パック数量スペック項目有無フラグ
	 * - スペック項目にパック数量(E999)が含まれているかを表すフラグ
	 *   0: 含まない
	 *   1: 含む
	 * - example: 0
	 */
	packageSpecFlag: Flag;
	/**
	 * 補正キーワード
	 * - ユーザ入力文字から型番検索に使う文字を抽出した文字列。
	 *   ＜例＞
	 *   リクエストキーワード："デイトン　sjx10 13_100_TiCN　　　"
	 *   補正キーワード："SJX10 13_100_TICN"
	 * - example: SJX10 13_100_TICN
	 * - NOTE: ・先頭全角文字を除去「型番 SFJ3-10」対応
	 *         ・後方空白除去
	 *         ・大文字小文字、全角半角の統一（大文字化）
	 */
	normalizedKeyword: string;
	/**
	 * 検索キーワード
	 * - 内部的に検索を実行した文字列。
	 *   ＜例＞
	 *   補正キーワード："SJX10 13_100_TICN"
	 *   検索キーワード："SJX10-13-100-XCN"
	 * - example: SJX10-13-100-XCN
	 * - NOTE: 顧客型式で返却する。
	 *         Dayton品でチェックマスタ上はX2Aで、型式変換によってX2になる場合、X2で返却する。
	 */
	searchedKeyword: string;
	/**
	 * 型番候補
	 * - 型番候補の文字列
	 * - example: SFJ3-[10-400/1]
	 */
	partNumber: string;
	/**
	 * 確定タイプ
	 * - 確定タイプ
	 *   2: タイプまで確定済み
	 *   3: インナーまで確定済み
	 *   4: フル型番確定済み
	 * - example: 2
	 */
	completeType: string;
	/**
	 * 規格廃止日
	 * - シリーズ状態:3 (規格廃止品)の場合のみ返却
	 *   規格廃止した日付(YYYY/MM/DD)
	 * - example: 2016/06/01
	 */
	discontinuedDate?: string;
	/**
	 * 代替品メッセージ
	 * - シリーズ状態:3 (規格廃止品)の場合のみ返却
	 *   代替品に関する情報を表すメッセージ。代替品の型番は「<>」で囲んで返却する
	 * - example: 代替品は<PCA10-30-B-1000-X>でご注文下さい。
	 */
	alternativeMessage?: string;
	/**
	 * ユニットコード(仮)リスト
	 * - コンベヤの部材品を特定するためのユニットコード。
	 *   統合インナーコードを利用。
	 * - maxLength: 14
	 * - example: MDM00001066213
	 */
	unitCodeList?: string[];
	/**
	 * インナーコード
	 * - MDMの統合インナーコード
	 * - maxLength: 14
	 * - example: MDM00004097801
	 */
	innerCode?: string;
	/**
	 * 即納配送可フラグ
	 * - 即納対応可能かどうか(中国のみ)
	 *   0: 非対応
	 *   1: 対応
	 * - example: 1
	 */
	promptDeliveryFlag?: Flag;
	/**
	 * 特別配送料有フラグ
	 * - 特別配送料の対象商品かどうか
	 *   0：特別配送料対象外
	 *   1：特別配送料対象
	 * - example: 1
	 */
	specialShipmentFlag?: Flag;
}

/** 商品画像 */
export interface ProductImage {
	/**
	 * タイプ
	 * - 画像のタイプ
	 *   1: 通常画像
	 *   2: 拡大表示対応画像
	 *   3: ...
	 * - example: 1
	 */
	type: string;
	/**
	 * URL
	 * - 画像のURL
	 * - example: //misumi.scene7.com/is/image/misumi/110300004660_20149999_m_01_99999_jp
	 */
	url: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - example: MEB2211
	 * - NOTE: 画像ごとの説明文が存在しない場合は、シリーズ名称を設定する
	 */
	comment?: string;
}

/** アイコンタイプ */
export interface IconType {
	/**
	 * アイコンタイプ
	 * - シリーズのアイコン情報
	 *   1: 新商品
	 *   2: 脱脂洗浄
	 *   3: 規格拡大
	 *   4: 規格変更
	 *   5: 価格改定
	 *   6: 値下げ
	 *   7: 納期短縮
	 *   8: 規格拡張対象
	 *   1000: 数量スライド割引
	 *   1001: 定期便対象
	 *   1002: サンプル品対象
	 *   1003: SDS(MSDS)
	 * - example: 4
	 * - NOTE: 定期便対象、サンプル品対象については、型番別PDF表示マスタ(displayLinkByInner.tsv)で、link_title の値が「ミスミ定期便申込み」、「サンプル提供申込み」がある場合に表示する
	 */
	iconType?: IconTypeEnum;
	/**
	 * アイコンタイプ表示文言
	 * - シリーズのアイコン情報の表示文言
	 * - example: 4
	 * - NOTE: 定期便対象、サンプル品対象については、型番別PDF表示マスタ(displayLinkByInner.tsv)で、link_title の値が「ミスミ定期便申込み」、「サンプル提供申込み」がある場合に表示する
	 */
	iconTypeDisp?: string;
}

/** ピクト */
export interface Pict {
	/**
	 * ピクト
	 * - ピクトの文言
	 * - example: 大口分納
	 */
	pict?: string;
	/**
	 * ピクトコメント
	 * - ピクトのコメント
	 * - example: 大口数量を“お得な価格”で分納にてお届け致します。
	 */
	pictComment?: string;
}

/** CADタイプ */
export interface CadType {
	/**
	 * CADタイプ
	 * - CADの種別
	 *   1: 2D
	 *   2: 3D
	 * - example: 1
	 */
	cadType?: CadTypeEnum;
	/**
	 * CADタイプ表示文言
	 * - CAD種別の表示文言
	 * - example: 2D
	 */
	cadTypeDisp?: string;
}

import { Flag } from '@/models/api/Flag';
import ExpressType from '@/models/api/constants/ExpressType';
import UnfitType from '@/models/api/constants/UnfitType';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 価格チェックAPIレスポンス */
export interface CheckPriceResponse extends MsmApiResponse {
	/**
	 * 価格リスト
	 * - 価格チェック結果の商品リスト
	 */
	priceList: Price[];
}

/** 価格 */
export interface Price {
	/**
	 * 型番
	 * - 入力した型番
	 * - maxLength: 74
	 * - example: SFJ3-10
	 */
	partNumber: string;
	/**
	 * 標準カタログ型番
	 * - 価格チェック結果の型番。
	 *   商品変換等で入力値の型番と異なる可能性あり。
	 * - maxLength: 74
	 * - example: SFJ3-10
	 */
	standardPartNumber?: string;
	/**
	 * インナーコード
	 * - 価格チェックした商品のインナーコード
	 * - maxLength: 11
	 */
	innerCode?: string;
	/**
	 * ブランドコード
	 * - WOSに検索をかけた際のブランドコード
	 * - maxLength: 4
	 * - example: MSM1
	 * - NOTE: リクエストで"MSM"（3桁）がきた際は、末尾に"1"を付加するのでレスポンスには"MSM1"（4桁）を返す。
	 */
	brandCode?: string;
	/**
	 * 商品名
	 * - 商品のWOS上の名前
	 * - maxLength: 30
	 * - example: ｼｬﾌﾄ
	 */
	productName?: string;
	/**
	 * 単価
	 * - 価格チェック結果の単価。
	 *   顧客向け値引、数量スライド、バラチャージが考慮されている
	 * - maxLength: 9
	 * - example: 198
	 * - NOTE: 価格空白、価格都度の場合はnull
	 */
	unitPrice?: number;
	/**
	 * 標準単価
	 * - 数量スライド、バラチャージのみ考慮された標準単価
	 * - maxLength: 9
	 * - example: 210
	 * - NOTE: 価格空白、価格都度の場合はnull
	 */
	standardUnitPrice?: number;
	/**
	 * 内容量単価
	 * - 標準単価をパック品入り数で割った内容量当たり単価
	 * - maxLength: 9
	 * - example: 210
	 * - NOTE: 価格空白、価格都度の場合はnull
	 */
	pricePerPiece?: number;
	/**
	 * 数量
	 * - 価格チェックをした数量
	 * - maxLength: 9
	 * - example: 2
	 * - NOTE: "quantity" is not optional, because default request quantity is 1.
	 */
	quantity: number;
	/**
	 * 在庫数量
	 * - 在庫数量
	 * - maxLength: 9
	 * - example: 100
	 */
	stockQuantity?: number;
	/**
	 * 合計金額
	 * - 単価×数量の計算結果
	 * - maxLength: 9
	 * - example: 396
	 * - NOTE: 価格空白、価格都度の場合はnull
	 */
	totalPrice?: number;
	/**
	 * 税込合計金額
	 * - 税込みの合計金額
	 * - maxLength: 9?
	 * - example: 427
	 * - NOTE: 価格空白、価格都度の場合はnull
	 */
	totalPriceIncludingTax?: number;
	/**
	 * 通貨コード
	 * - 通貨コード
	 *   JPY: 日本円
	 *   RMB: 人民元
	 * - maxLength: 3
	 */
	currencyCode?: string;
	/**
	 * ストーク
	 * - 入力したストーク
	 *   一部の早割商品など、入力パラメタとは異なる値を返す可能性あり
	 * - maxLength: ２
	 * - example: T0
	 */
	expressType?: string;
	/**
	 * ストーク表示文言
	 * - ストークの表示文言
	 */
	expressTypeDisp?: string;
	/**
	 * 出荷日数
	 * - 出荷までの実働日数
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 *   99: 別途調整、都度見積り
	 * - maxLength: 9
	 * - example: 3
	 * - NOTE: 納期空白、納期都度の場合はnull
	 *         購買連携時に大口もしくは都度で出荷日数が指定されていなかった場合、ユーザ情報から取得した出荷日数に置き換えて返却する
	 */
	daysToShip?: number;
	/**
	 * 出荷日
	 * - 出荷日の日付(YYYY/MM/DD)
	 * - maxLength: 10
	 * - example: 2015/06/01
	 * - NOTE: 納期空白、納期都度の場合はnull
	 */
	shipDate?: string;
	/**
	 * 顧客到着日
	 * - 顧客への到着日の日付(YYYY/MM/DD)
	 * - maxLength: 10
	 * - example: 2015/06/02
	 * - NOTE: 納期空白、納期都度の場合はnull
	 */
	deliveryDate?: string;
	/**
	 * 出荷区分
	 * - 出荷区分
	 *   1: 在庫品
	 *   2: 在庫手配中
	 *   3: 土祝含まず
	 *   4: 土曜含まず
	 *   5: 祝日含まず
	 * - maxLength: 1
	 * - example: 1
	 */
	shipType?: string;
	/**
	 * 出荷区分表示文言
	 * - 出荷区分の表示文言
	 */
	shipTypeDisp?: string;
	/**
	 * 長納期品出荷日数閾値
	 * - 長納期品の閾値となる出荷日数
	 * - maxLength: 9?
	 * - example: 10
	 */
	longLeadTimeThreshold?: number;
	/**
	 * 最低発注数量
	 * - 注文を受け付ける最低数量
	 *   発注数がこの数量未満の場合はエラー
	 * - maxLength: 9?
	 */
	minQuantity?: number;
	/**
	 * 発注単位数量
	 * - 注文を受け付ける単位数量
	 *   発注数がこの数量の倍数でない場合はエラー
	 * - maxLength: 9?
	 */
	orderUnit?: number;
	/**
	 * パック品入数
	 * - 1商品に複数個入っている場合(パック品)の入数。
	 *   ※レスポンス内の各種数量は入数ではなくパック数
	 * - maxLength: 9?
	 */
	piecesPerPackage?: number;
	/**
	 * 内容量
	 * - 商品の内容量(E999の値)
	 * - example: 1ケース（840ml×30本）
	 */
	content?: string;
	/**
	 * 受注〆時刻
	 * - 受注の〆時刻(HH:MM)
	 *   この時刻を超過した場合は翌日扱いとなる
	 * - maxLength: 5
	 */
	orderDeadline?: string;
	/**
	 * 大口下限数量
	 * - 大口下限の数量
	 * - maxLength: 9?
	 */
	largeOrderMinQuantity?: number;
	/**
	 * 大口上限数量
	 * - 大口上限の数量
	 * - maxLength: 9?
	 */
	largeOrderMaxQuantity?: number;
	/**
	 * 価格都度フラグ
	 * - 価格都度
	 *   0: 価格都度でない
	 *   1: 価格都度である
	 */
	priceInquiryFlag?: Flag;
	/**
	 * 納期都度フラグ
	 * - 納期都度
	 *   0: 納期都度でない
	 *   1: 納期都度である
	 * - example: 1
	 */
	daysToShipInquiryFlag?: Flag;
	/**
	 * 重量
	 * - 商品の重量
	 * - maxLength: 9?
	 * - example: 276.02
	 */
	weight?: number;
	/**
	 * 重量単位
	 * - 商品の重量単位
	 * - example: g
	 */
	weightUnit?: string;
	/**
	 * スライド情報リスト
	 */
	volumeDiscountList?: VolumeDiscount[];
	/**
	 * ストーク情報リスト
	 */
	expressList?: Express[];
	/**
	 * バラチャージ
	 */
	lowVolumeCharge?: LowVolumeCharge;
	/**
	 * アンフィット区分
	 * - アンフィット区分
	 *   0: アンフィットではない
	 *   1: 納期短縮（指定納期＜ACE､ECAL算出納期）
	 *   2: 大口（商品マスター_大口上限数量 ≦注文数）
	 *   3: 特注（%、＠、#マークで始まる規格外商品）
	 *   4: 規格外（規格計算式エラー等）
	 *   5: 未登録（ACEでは未発生。規格外に含まれる）
	 *   6: 複数
	 *   7: 事業部（商品マスター_受注メッセージ登録あり）
	 *   8: 都度（商品マスター_大口下限上限=1かつ納期99）
	 *   9: その他（バリデーションチェックエラー）
	 *   S: システム（ACE-エコール間の通信エラー）
	 * - maxLength: 1
	 */
	unfitType?: UnfitType;
	/**
	 * アンフィット区分表示文言
	 * - アンフィット区分の表示文言
	 */
	unfitTypeDisp?: string;
	/**
	 * 特別配送課金区分
	 * - 特別配送課金区分
	 *   0: 課金なし
	 *   1: 特別配送課金あり（数量ベース）
	 *   2: 特別配送課金あり（Recベース）
	 * - maxLength: 1
	 * - example: 1
	 */
	specialShipmentType?: string;
	/**
	 * 特別配送料
	 * - 特別配送料
	 * - maxLength: 14
	 * - example: 300
	 */
	specialShipmentFee?: number;
	/**
	 * 購買連携情報
	 */
	purchase?: Purchase;
	/**
	 * エラーリスト
	 * - NOTE: 特別配送課金区分が「1」or「2」の場合のみ、下記の情報を返却
	 *         【特別配送料メッセージ】
	 *         　・エラーコード：WOS040～WOS045
	 *         　・エラータイプ：2
	 *         　・エラーメッセージ：WOSから返却されたメッセージ
	 *         　・エラーパラメータリスト：WOSから返却されたメッセージ
	 */
	errorList?: Error[];
}

/** スライド情報 */
export interface VolumeDiscount {
	/**
	 * 最小数量
	 * - スライド数量の下限値
	 * - maxLength: 9?
	 * - example: 1
	 */
	minQuantity?: number;
	/**
	 * 最大数量
	 * - スライド数量の上限値(単一の値の場合、上限と下限が同一値になる)
	 * - maxLength: 9?
	 * - example: 9
	 */
	maxQuantity?: number;
	/**
	 * 単価
	 * - スライド時の単価
	 * - maxLength: 9?
	 */
	unitPrice?: number;
	/**
	 * 出荷日数
	 * - 出荷までの実働日数
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 *   99: 別途調整、都度見積り
	 * - maxLength: 9?
	 */
	daysToShip?: number;
}

/** ストーク情報 */
export interface Express {
	/**
	 * ストーク
	 * - ストーク
	 *   T0: ストークT
	 *   A0: ストークA
	 *   B0: ストークB
	 *   C0: ストークC
	 *   Z0: ストークZ
	 *   0A: ストークA早割
	 *   40: ストークL
	 * - maxLength: 1
	 */
	expressType?: ExpressType;
	/**
	 * ストーク表示文言
	 * - ストークの表示文言
	 */
	expressTypeDisp?: string;
	/**
	 * 料金計算方式
	 * - ストーク料金の計算方式
	 *   1: 個
	 *   2: 明細行
	 * - maxLength: 1
	 */
	chargeType?: string;
	/**
	 * 料金
	 * - 割増料金
	 *   (Zストークの場合は割引料金)
	 * - maxLength: 9?
	 */
	charge?: number;
	/**
	 * ストーク〆時刻
	 * - ストークの〆時刻(HH:MM)
	 * - maxLength: 5
	 */
	expressDeadline?: string;
}

/** バラチャージ */
export interface LowVolumeCharge {
	/**
	 * 料金計算方式
	 * - バラチャージ料金の計算方式
	 *   1: 個 ... 商品1個あたりに料金を加算
	 *   2: 明細行 ... 料金を注文数量で按分して(1円未満切り捨て)加算
	 * - maxLength: 1
	 */
	chargeType?: string;
	/**
	 * 通常単価
	 * - バラチャージ料金を含まない通常単価
	 */
	standardUnitPrice?: number;
	/**
	 * バラチャージ料金
	 * - 商品1個当たりのバラチャージ料金
	 */
	charge?: number;
}

/** 購買連携情報 */
export interface Purchase {
	/**
	 * 禁止ブランドコードフラグ
	 * - 得意先ごとに定義されたチェックアウト禁止のブランドコードかどうか
	 *   0: 禁止ブランドコードでない(チェックアウト可)
	 *   1: 禁止ブランドコード(チェックアウト不可)
	 */
	invalidBrandCodeFlag?: Flag;
	/**
	 * 禁止インナーコードフラグ
	 * - 得意先ごとに定義されたチェックアウト禁止のインナーコードかどうか
	 *   0: 禁止インナーコードでない(チェックアウト可)
	 *   1: 禁止インナーコード(チェックアウト不可)
	 */
	invalidInnerCodeFlag?: Flag;
	/**
	 * 禁止分析コードフラグ
	 * - 得意先ごとに定義されたチェックアウト禁止の分析コードかどうか
	 *   0: 禁止分析コードでない(チェックアウト可)
	 *   1: 禁止分析コード(チェックアウト不可)
	 */
	invalidClassifyCodeFlag?: Flag;
	/**
	 * 禁止型番フラグ
	 * - 得意先ごとに定義された禁止文字が型番に含まれているかどうか
	 *   0: 含まれていない(チェックアウト可)
	 *   1: 含まれている(チェックアウト不可)
	 */
	invalidPartNumberFlag?: Flag;
	/**
	 * チェックアウト可能単価超過フラグ
	 * - 得意先ごとに定義されたチェックアウトな単価を超過しているかどうか
	 *   0: 超過していない(チェックアウト可)
	 *   1: 超過している(チェックアウト不可)
	 */
	invalidUnitPriceFlag?: Flag;
}

/** エラー */
export interface Error {
	/**
	 * エラーコード
	 * - エラーのコード
	 *   BTCエラーの場合はエラー種別
	 *   E: エラー
	 *   W: 警告
	 *   I: インフォーメーション
	 * - maxLength: 9
	 * - example: WOS009
	 */
	errorCode?: string;
	/**
	 * エラータイプ
	 * - メッセージの種別
	 *   0: 業務エラー
	 *   1: 規格エラー
	 *   2: WOSエラー
	 *   3: NRIエラー
	 *   4: BTCエラー
	 *   ※基幹システム(ACE)からのエラーの場合、上記以外の値が返る場合あり
	 * - maxLength: 1
	 * - example: 2
	 */
	errorType?: string;
	/**
	 * エラーメッセージ
	 * - maxLength: 500
	 */
	errorMessage?: string;
	/**
	 * エラーパラメータリスト
	 * - example: ["A8.10/0/1500"]
	 */
	errorParameterList?: ErrorParameter[];
}

/** エラーパラメータ */
export interface ErrorParameter {}

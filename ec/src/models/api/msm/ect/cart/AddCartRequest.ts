import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** カート追加APIリクエスト */
export interface AddCartRequest extends MsmApiRequest {
	/**
	 * カート明細リスト
	 * - カートに追加する商品のリスト
	 */
	cartItemList: CartItem[];
	/**
	 * 価格チェック実行フラグ
	 * - カート追加前に価格チェックを実行するかどうか
	 *   0: 実行しない
	 *   1: 実行する
	 * - default: 1
	 */
	priceCheckFlag?: Flag;
	/**
	 * サイトコード
	 * - カートに追加するサイトのコード
	 *   1: eカタログ
	 *   20: スマホサイト
	 * - default: 1
	 */
	siteCode?: string;
}

/** カート明細 */
export interface CartItem {
	/**
	 * シリーズコード
	 * - カートに追加する商品のシリーズコード
	 * - NOTE: 1つのインナーが複数のシリーズに紐付いているなどの際に、明示的にシリーズコードを指定する場合にセット
	 */
	seriesCode?: string;
	/**
	 * ブランドコード
	 * - カートに追加する商品のブランドコード
	 * - example: MSM1
	 * - NOTE: 3桁のブランドコード(MSM)が渡された場合は、"1"を付加したブランドコード(MSM1)で価格チェックを実行
	 */
	brandCode: string;
	/**
	 * 型番
	 * - カートに追加する商品の型番
	 * - maxLength: 74
	 * - example: SFJ3-10
	 */
	partNumber: string;
	/**
	 * 数量
	 * - カートに追加する数量
	 * - minLength: 1
	 * - maxLength: 99999
	 * - default: 1
	 * - example: 1
	 */
	quantity?: number;
	/**
	 * インナーコード
	 * - 価格チェックを実行しない場合に設定する値
	 * - NOTE: 価格チェック結果の値を指定
	 */
	innerCode?: string;
	/**
	 * 単価
	 * - 価格チェックを実行しない場合に設定する値
	 * - NOTE: 価格チェック結果の値を指定
	 */
	unitPrice?: number;
	/**
	 * 標準単価
	 * - 価格チェックを実行しない場合に設定する値
	 * - NOTE: 価格チェック結果の値を指定
	 */
	standardUnitPrice?: number;
	/**
	 * 出荷日数
	 * - 価格チェックを実行しない場合に設定する値
	 * - NOTE: 価格チェック結果の値を指定
	 */
	daysToShip?: number;
	/**
	 * 出荷区分
	 * - 価格チェックを実行しない場合に設定する値
	 * - NOTE: 価格チェック結果の値を指定
	 */
	shipType?: string;
	/**
	 * パック品入数
	 * - 価格チェックを実行しない場合に設定する値
	 * - NOTE: 価格チェック結果の値を指定
	 */
	piecesPerPackage?: number;
	/**
	 * 商品タイプ
	 * - My部品表に追加する商品タイプ
	 *   1: 通常商品
	 *   2: モジュラアッセンブラ
	 *   3: モジュラ品の構成部品
	 * - default: 1
	 */
	productType?: string;
	/**
	 * 商品名
	 * - カートに追加する商品名
	 * - example: リニアユニットＡ / シャフト ストレート & リニアブッシュハウジングユニット トールブロック　シングル & シャフトホルダ Ｔ型側方スリット (識別記号：#MA821)
	 * - NOTE: モジュラ品の構成部品を追加する場合や、注文・見積履歴からカートに追加する場合に設定する値
	 */
	productName?: string;
	/**
	 * 商品ページURL
	 * - カートに追加する商品ページのURL
	 * - example: //jp.misumi-ec.com/ec/Module.html?id=MM000028350&ref=item
	 * - NOTE: モジュラ品の構成部品を追加する場合や、注文・見積履歴からカートに追加する場合に設定する値
	 */
	productPageUrl?: string;
	/**
	 * 商品画像URL
	 * - カートに追加する商品画像のURL
	 * - example: //jp.misumi-ec.com/resource/modular/mech/mm/MM000028350.jpg
	 * - NOTE: モジュラ品の構成部品を追加する場合や、注文・見積履歴からカートに追加する場合に設定する値
	 */
	productImageUrl?: string;
	/**
	 * キャンペーン終了日
	 * - カートに追加するキャンペーン終了日
	 * - example: 2017/12/31
	 * - NOTE: モジュラ品の構成部品を追加する場合や、注文・見積履歴からカートに追加する場合に設定する値
	 */
	campaignEndDate?: string;
}

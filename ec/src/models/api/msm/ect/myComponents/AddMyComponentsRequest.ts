import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** My部品表追加APIリクエスト */
export interface AddMyComponentsRequest extends MsmApiRequest {
	/**
	 * テストWOS
	 * - テスト時に商品の内容を変化させるためのパラメータ
	 */
	testWos?: string;
	/**
	 * 部品リスト
	 * - My部品表に追加する商品のリスト
	 */
	myComponentsItemList: MyComponentsItem[];
	/**
	 * 価格チェック実行フラグ
	 * - My部品表追加前に価格チェックを実行するかどうか
	 *   0: 実行しない
	 *   1: 実行する
	 * - default: 1
	 */
	priceCheckFlag?: Flag;
	/**
	 * サイトコード
	 * - カートに追加するサイトコード
	 *   1: eカタログ
	 *   20: スマホサイト
	 * - default: 1
	 */
	siteCode?: string;
}

/** 部品 */
export interface MyComponentsItem {
	/**
	 * シリーズコード
	 * - カートに追加する商品のシリーズコード
	 * - NOTE: 1つのインナーが複数のシリーズに紐付いているなどの際に、明示的にシリーズコードを指定する場合にセット
	 */
	seriesCode?: string;
	/**
	 * ブランドコード
	 * - My部品表に追加する商品のブランドコード
	 * - example: MSM1
	 * - NOTE: 3桁のブランドコード(MSM)が渡された場合は、"1"を付加したブランドコード(MSM1)で価格チェックを実行
	 */
	brandCode: string;
	/**
	 * 型番
	 * - My部品表に追加する商品の型番
	 * - maxLength: 74
	 * - example: SFJ3-10
	 */
	partNumber: string;
	/**
	 * 数量
	 * - My部品表に追加する数量
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
	 * - My部品表に追加する商品名
	 * - example: リニアユニットＡ / シャフト ストレート & リニアブッシュハウジングユニット トールブロック　シングル & シャフトホルダ Ｔ型側方スリット (識別記号：#MA821)
	 * - NOTE: カート・注文・見積履歴からMy部品表に追加する場合に設定する値
	 */
	productName?: string;
	/**
	 * 商品ページURL
	 * - My部品表に追加する商品ページのURL
	 * - example: //jp.misumi-ec.com/ec/Module.html?id=MM000028350&ref=item
	 * - NOTE: カート・注文・見積履歴からMy部品表に追加する場合に設定する値
	 */
	productPageUrl?: string;
	/**
	 * 商品画像URL
	 * - My部品表に追加する商品画像のURL
	 * - example: //jp.misumi-ec.com/resource/modular/mech/mm/MM000028350.jpg
	 * - NOTE: カート・注文・見積履歴からMy部品表に追加する場合に設定する値
	 */
	productImageUrl?: string;
	/**
	 * キャンペーン終了日
	 * - My部品表に追加するキャンペーン終了日
	 * - example: 43100
	 * - NOTE: カート・注文・見積履歴からMy部品表に追加する場合に設定する値
	 */
	campaignEndDate?: string;
}

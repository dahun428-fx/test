import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 価格チェックAPIリクエスト */
export interface CheckPriceRequest extends MsmApiRequest {
	/**
	 * テストWOS
	 * - テスト時に価格チェック結果を変化させるためのパラメータ
	 * - NOTE: 「【備考】テストWOS」シート参照
	 */
	testWos?: string;
	/**
	 * 分析対象
	 * - ACEエラーログ(WOS)の分析対象とするかどうか
	 *   true: 分析対象とする
	 *   false: 分析対象としない
	 * - default: true
	 */
	analyze?: string;
	/**
	 * 呼び出し元
	 * - ACEエラーログに出力する呼び出し元を表す文字列
	 * - NOTE: falseを指定した場合のみ有効
	 */
	caller?: string;
	/**
	 * 詳細エラーメッセージ返却フラグ
	 * - 価格チェックのリクエストに対してエラーの詳細メッセージの返却する・しないの判定フラグ
	 *   0: しない
	 *   1: する
	 * - default: 0
	 * - NOTE: 詳細メッセージのフラグは一般ユーザーだけ有効、返却パターンは「パラメータ追加」シートを参照
	 */
	detailMessageResponseFlag?: Flag;
	/**
	 * 商品リスト
	 * - 価格チェックする商品のリスト
	 * - maxLength: 50
	 */
	productList: Product[];
}

/** 商品 */
export interface Product {
	/**
	 * 型番
	 * - 価格チェックする商品の型番
	 * - maxLength: 74
	 * - example: SFJ3-10
	 */
	partNumber: string;
	/**
	 * ブランドコード
	 * - 価格チェックするブランドコード
	 * - minLength: 3
	 * - maxLength: 4
	 * - example: MSM1
	 * - NOTE: 3桁のブランドコード(MSM)が渡された場合は、"1"を付加したブランドコード(MSM1)で価格チェックを実行
	 */
	brandCode?: string;
	/**
	 * 数量
	 * - 価格チェックする数量
	 * - minLength: 1
	 * - maxLength: 99999
	 * - default: 1
	 * - example: 1
	 */
	quantity?: number;
	/**
	 * ストーク
	 * - 価格チェックするストーク
	 *   T0: ストークT
	 *   A0: ストークA
	 *   B0: ストークB
	 *   C0: ストークC
	 *   Z0: ストークZ
	 *   0A: 早割ストークA
	 *   40: ストークL
	 * - example: T０
	 */
	expressType?: string;
}

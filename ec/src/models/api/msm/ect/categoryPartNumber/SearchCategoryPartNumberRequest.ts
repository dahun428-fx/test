import { MsmApiRequest, Flag } from '@misumi-org/msm-api-client-sdk';

/** カテゴリ型番検索APIリクエスト */
export interface SearchCategoryPartNumberRequest extends MsmApiRequest {
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: misumi
	 * - NOTE: ブランドコードもしくはブランドURLコードでの絞り込み条件。カンマで区切ることで複数指定可
	 */
	brandCode?: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - example: E1400000000,E2205010000
	 * - NOTE: カテゴリコードでの絞込条件。カンマで区切ることで複数指定可。
	 */
	categoryCode?: string;
	/**
	 * 選択項目
	 * - シリーズ絞込条件に指定するスペックコードおよびスペック値を指定
	 * - example: E01=100&E02=10,20
	 * - NOTE: スペックコード＝スペック値の形式で指定。複数指定可。
	 *         E01=100,200＆E02=10,20
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[specCode: string]: any;
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
	 * - シリーズ絞り込み条件に指定する出荷日数
	 * - example: 3
	 * - NOTE: 出荷日数での絞込条件。指定された出荷日の型番が存在しない場合は、指定した値に最も近く、かつ、早い出荷日を指定したものと解釈する。
	 */
	daysToShip?: number;
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
	 * - default: 10
	 * - example: 40
	 */
	pageSize?: number;
}

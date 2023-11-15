import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 関連型番検索APIリクエスト */
export interface SearchRelatedPartNumberRequest extends MsmApiRequest {
	/**
	 * シリーズコード
	 * - 検索対象のシリーズコード
	 * - example: 110302634310
	 */
	seriesCode: string;
	/**
	 * 型番
	 * - 検索対象の型番
	 * - example: ZSFJ10-100
	 */
	partNumber?: string;
	/**
	 * 取得件数
	 * - 型番指定しなかった場合にホワイトリストマスタの検索結果から取得する件数
	 * - default: 0
	 * - NOTE: @default指定や型番指定する場合は参照されない
	 */
	size?: number;
	/**
	 * 取得先頭位置
	 * - 型番指定しなかった場合にホワイトリストマスタの検索結果から取得を開始する先頭の位置(1,2,3...)
	 * - default: 1
	 * - NOTE: @default指定や型番指定する場合は参照されない
	 */
	position?: number;
}

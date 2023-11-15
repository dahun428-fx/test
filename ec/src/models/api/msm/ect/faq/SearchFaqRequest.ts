import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** FAQ情報取得APIリクエスト */
export interface SearchFaqRequest extends MsmApiRequest {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - minLength: 12
	 * - maxLength: 12
	 * - example: 110400390650
	 */
	seriesCode: string;
	/**
	 * 取得件数
	 * - 取得するレコード件数を指定する
	 * - minLength: 1
	 * - default: 10
	 * - example: 1
	 * - NOTE: LIMIT
	 */
	count?: number;
}

import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** COMBO検索APIリクエスト */
export interface SearchComboRequest extends MsmApiRequest {
	/**
	 * 型番
	 * - 型番
	 * - maxLength: 100
	 * - example: SFJ3-1000
	 */
	partNumber: string;
	/**
	 * 取得件数
	 * - 候補の型番を最大いくつまで取得するか
	 * - minLength: 1
	 * - maxLength: 99
	 * - default: 5
	 * - example: 5
	 */
	count?: number;
}

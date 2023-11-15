import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** CAD利用規定取得APIリクエスト */
export interface TermsOfUseCadRequest extends MsmApiRequest {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - example: 110302634310
	 */
	seriesCode: string;
	/**
	 * CAD ID
	 * - 型番検索APIで返却されたCAD IDを指定する
	 * - example: 10000000449,10000000459
	 * - NOTE: 複数の場合はカンマで区切って指定
	 */
	cadId?: string;
	/**
	 * 型番
	 * - 型番が確定している場合は必須
	 * - example: SFJ3-10
	 */
	partNumber?: string;
}

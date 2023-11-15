import { Flag } from '@/models/api/Flag';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 注文情報取得APIリクエスト */
export interface GetOrderInfoRequest extends MsmApiRequest {
	/**
	 * 強制取得フラグ
	 * - DBから強制的に取得するかどうか
	 *   0: キャッシュが存在する場合はキャッシュから取得
	 *   1: キャッシュの有無に関わらずDBから取得
	 * - default: 0
	 * - example: true
	 */
	forceFlag?: Flag;
}

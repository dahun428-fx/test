import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

/**
 * ViewHistory Request
 */
export interface GetViewHistoryRequest extends CameleerApiRequest {
	/** クッキーID */
	x: string;
	/** シリーズコード */
	x2: string;
}

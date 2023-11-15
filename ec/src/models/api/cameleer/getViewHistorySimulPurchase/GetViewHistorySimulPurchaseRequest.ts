import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

/**
 * 閲覧商品同時購入 取得リクエスト
 */
export interface GetViewHistorySimulPurchaseRequest extends CameleerApiRequest {
	/** クッキーID */
	x: string;
	/** 直近閲覧したシリーズコード */
	x2?: string;
}

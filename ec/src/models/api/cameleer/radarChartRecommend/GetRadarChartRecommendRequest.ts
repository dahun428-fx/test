import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

/**
 * レーダーチャートレコメンド 取得リクエスト
 */
export interface GetRadarChartRecommendRequest extends CameleerApiRequest {
	/** クッキーID */
	x: string;
}

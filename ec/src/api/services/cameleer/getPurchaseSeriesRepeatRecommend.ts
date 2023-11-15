import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetPurchaseSeriesRepeatRecommendRequest } from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendRequest';
import { GetPurchaseSeriesRepeatRecommendResponse } from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendResponse';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Get Radar Chart Recommend Content
 * @param {GetRadarChartRecommendRequest} request - request parameters
 * @returns {Promise<GetRadarChartRecommendResponse>}
 */
export function getPurchaseSeriesRepeatRecommend(): Promise<GetPurchaseSeriesRepeatRecommendResponse | null> {
	return cameleerApi
		.get<
			GetPurchaseSeriesRepeatRecommendRequest,
			GetPurchaseSeriesRepeatRecommendResponse
		>('/cameleer/REST/PurchaseSeriesRepeatRecommend', {
			subsidiary: config.subsidiaryCode,
			x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
			dispPattern: 'CFM',
			dispPage: 'mypage',
		})
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

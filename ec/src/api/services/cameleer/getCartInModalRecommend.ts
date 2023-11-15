import { CancelToken } from 'axios';
import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetCartInModalRecommendRequest } from '@/models/api/cameleer/getCartInModalRecommend/GetCartInModalRecommendRequest';
import { GetCartInModalRecommendResponse } from '@/models/api/cameleer/getCartInModalRecommend/GetCartInModalRecommendResponse';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Get cart in modal recommend
 * @param request
 * @param cancelToken
 * @returns
 */
export function getCartInModalRecommend(
	payload: { seriesCode: string; dispPage: string },
	cancelToken?: CancelToken
): Promise<GetCartInModalRecommendResponse | null> {
	return cameleerApi
		.get<GetCartInModalRecommendRequest, GetCartInModalRecommendResponse>(
			'/cameleer/REST/CartInModalRecommend',
			{
				subsidiary: config.subsidiaryCode,
				x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
				x2: payload.seriesCode,
				dispPage: payload.dispPage,
			},
			{ cancelToken }
		)
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

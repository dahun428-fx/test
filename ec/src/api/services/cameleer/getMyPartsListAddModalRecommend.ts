import { CancelToken } from 'axios';
import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetMyPartsListAddModalRecommendRequest } from '@/models/api/cameleer/getMyPartsListAddModalRecommend/GetMyPartsListAddModalRecommendRequest';
import { GetMyPartsListAddModalRecommendResponse } from '@/models/api/cameleer/getMyPartsListAddModalRecommend/GetMyPartsListAddModalRecommendResponse';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Get My Parts List Add Modal Recommend
 * @param seriesCode
 * @param cancelToken
 * @returns
 */
export function getMyPartsListAddModalRecommend(
	payload: { seriesCode: string; dispPage: string },
	cancelToken?: CancelToken
): Promise<GetMyPartsListAddModalRecommendResponse | null> {
	return cameleerApi
		.get<
			GetMyPartsListAddModalRecommendRequest,
			GetMyPartsListAddModalRecommendResponse
		>(
			'/cameleer/REST/MyPartsListAddModalRecommend',
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

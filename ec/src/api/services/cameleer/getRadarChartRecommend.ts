import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetRadarChartRecommendRequest } from '@/models/api/cameleer/radarChartRecommend/GetRadarChartRecommendRequest';
import { GetRadarChartRecommendResponse } from '@/models/api/cameleer/radarChartRecommend/GetRadarChartRecommendResponse';
import { assertNotNull } from '@/utils/assertions';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Get Radar Chart Recommend Content
 * @returns {Promise<GetRadarChartRecommendResponse>}
 */
export function getRadarChartRecommend(): Promise<GetRadarChartRecommendResponse | null> {
	const key = getCookie(Cookie.VONA_COMMON_LOG_KEY);
	assertNotNull(key);

	return cameleerApi
		.get<GetRadarChartRecommendRequest, GetRadarChartRecommendResponse>(
			'/cameleer/REST/RadarChartRecommendAllMisumi',
			{
				subsidiary: config.subsidiaryCode,
				dispPage: 'top',
				x: key,
				dispPattern: 'A',
			}
		)
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

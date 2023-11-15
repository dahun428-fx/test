import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetViewCategoryRecommendRequest } from '@/models/api/cameleer/getViewCategoryRecommend/GetViewCategoryRecommendRequest';
import { GetViewCategoryRecommendResponse } from '@/models/api/cameleer/getViewCategoryRecommend/GetViewCategoryRecommendResponse';
import { Cookie, getCookie } from '@/utils/cookie';

type GetViewCategoryRecommendParam = {
	x2: string;
	x3: string;
	dispPage?: string;
};

/**
 * Get View Category Recommend
 * @returns {Promise<GetViewCategoryRecommendResponse>}
 */
export async function getViewCategoryRecommend({
	x2,
	x3,
	dispPage = 'ctg3',
}: GetViewCategoryRecommendParam): Promise<GetViewCategoryRecommendResponse | null> {
	const key = getCookie(Cookie.VONA_COMMON_LOG_KEY);
	if (!key) {
		return null;
	}

	return cameleerApi
		.get<GetViewCategoryRecommendRequest, GetViewCategoryRecommendResponse>(
			'/cameleer/REST/ViewCategoryRecommend',
			{
				subsidiary: config.subsidiaryCode,
				x: key,
				x2,
				x3,
				dispPage,
			}
		)
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

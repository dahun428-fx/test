import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetViewCategoryRepeatRecommendRequest } from '@/models/api/cameleer/category/GetViewCategoryRepeatRecommendRequest';
import { GetViewCategoryRepeatRecommendResponse } from '@/models/api/cameleer/category/GetViewCategoryRepeatRecommendResponse';
import { assertNotNull } from '@/utils/assertions';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Get View Category Recommend
 * @returns {Promise<GetViewCategoryRepeatRecommendResponse>}
 */
export async function getViewCategoryRepeatRecommend(
	dispPage: string
): Promise<GetViewCategoryRepeatRecommendResponse | null> {
	const key = getCookie(Cookie.VONA_COMMON_LOG_KEY);
	assertNotNull(key);

	const categoryHistory = getCookie(Cookie.CATEGORY_VIEW_HISTORY);
	if (categoryHistory == null || categoryHistory.split(',').length === 0) {
		return null;
	}

	return cameleerApi
		.get<
			GetViewCategoryRepeatRecommendRequest,
			GetViewCategoryRepeatRecommendResponse
		>('/cameleer/REST/ViewCategoryRepeatRecommend', {
			subsidiary: config.subsidiaryCode,
			x: key,
			x2: categoryHistory.split('|').reverse().join(','),
			dispPage,
		})
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

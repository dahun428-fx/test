import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetPurchaseCategoryRepeatRecommendResponse } from '@/models/api/cameleer/getPurchaseCategoryRepeatRecommend/GetPurchaseCategoryRecommendResponse';
import { GetPurchaseCategoryRepeatRecommendRequest } from '@/models/api/cameleer/getPurchaseCategoryRepeatRecommend/GetPurchaseCategoryRepeatRecommendRequest';
import { Cookie, getCookie } from '@/utils/cookie';

type GetPurchaseCategoryRepeatRecommendParam = {
	dispPage: string;
};

/**
 * Get Purchase Category Repeat Recommend
 * @returns
 */
export async function getPurchaseCategoryRepeatRecommended({
	dispPage = 'ctg2',
}: GetPurchaseCategoryRepeatRecommendParam): Promise<GetPurchaseCategoryRepeatRecommendResponse | null> {
	const key = getCookie(Cookie.VONA_COMMON_LOG_KEY);
	if (!key) {
		return null;
	}

	return cameleerApi
		.get<
			GetPurchaseCategoryRepeatRecommendRequest,
			GetPurchaseCategoryRepeatRecommendResponse
		>('/cameleer/REST/PurchaseCategoryRepeatRecommend', {
			subsidiary: config.subsidiaryCode,
			x: key,
			dispPage,
		})
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

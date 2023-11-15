import { cameleerApi } from '@/api/clients';
import { config } from '@/config';
import { GetPurchaseCategoryRecommendRequest } from '@/models/api/cameleer/getPurchaseCategoryRecommend/GetPurchaseCategoryRecommendRequest';
import { GetPurchaseCategoryRecommendResponse } from '@/models/api/cameleer/getPurchaseCategoryRecommend/GetPurchaseCategoryRecommendResponse';
import { Cookie, getCookie } from '@/utils/cookie';

type GetPurchaseCategoryRecommendParam = {
	x2: string;
	x3: string;
	dispPage?: string;
};

/**
 * Get Purchase Category Recommend
 * @returns
 */
export async function getPurchaseCategoryRecommend({
	x2,
	x3,
	dispPage = 'ctg2',
}: GetPurchaseCategoryRecommendParam): Promise<GetPurchaseCategoryRecommendResponse | null> {
	const key = getCookie(Cookie.VONA_COMMON_LOG_KEY);
	if (!key) {
		return null;
	}

	return cameleerApi
		.get<
			GetPurchaseCategoryRecommendRequest,
			GetPurchaseCategoryRecommendResponse
		>('/cameleer/REST/PurchaseCategoryRecommend', {
			subsidiary: config.subsidiaryCode,
			x: key,
			x2,
			x3,
			dispPage,
		})
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}

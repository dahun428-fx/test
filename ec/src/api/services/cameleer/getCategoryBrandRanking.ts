import { CancelToken } from 'axios';
import { cameleerApi } from '@/api/clients';
import { GetCategoryBrandRankingRequest } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingRequest';
import { GetCategoryBrandRankingResponse } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingResponse';

/**
 * Get category brand ranking
 * @param {GetCategoryBrandRankingRequest} [request]
 * @param {CancelToken} [cancelToken]
 * @returns {Promise<GetCategoryBrandRankingResponse>}
 */
export function getCategoryBrandRanking(
	// TODO: Request そのものではなく、外から渡す必要のあるものだけに絞り、わかりやすい項目名にする。
	request: GetCategoryBrandRankingRequest,
	cancelToken?: CancelToken
): Promise<GetCategoryBrandRankingResponse> {
	return cameleerApi.get('/cameleer/REST/CategoryBrandRankingVona', request, {
		cancelToken,
	});
}

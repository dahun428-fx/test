import { ectApi } from '@/api/clients';
import { SearchInterestRecommendRequest } from '@/models/api/msm/ect/interestRecommend/SearchInterestRecommendRequest';
import { SearchInterestRecommendResponse } from '@/models/api/msm/ect/interestRecommend/SearchInterestRecommendResponse';

/**
 * Search interest recommended products
 * @param {SearchInterestRecommendRequest} request - request parameters
 * @returns {Promise<SearchInterestRecommendResponse>} response
 */
export function searchInterestRecommend(
	request: SearchInterestRecommendRequest
): Promise<SearchInterestRecommendResponse> {
	return ectApi.get('api/v1/interestRecommend/search', request);
}

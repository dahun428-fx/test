import { ectApi } from '@/api/clients';
import { SearchCategoryRecommendRequest } from '@/models/api/msm/ect/categoryRecommend/SearchCategoryRecommendRequest';
import { SearchCategoryRecommendResponse } from '@/models/api/msm/ect/categoryRecommend/SearchCategoryRecommendResponse';

/**
 * Search recommended products in same category
 * @param {SearchCategoryRecommendRequest} request - request parameters
 * @returns {Promise<SearchCategoryRecommendResponse>} response
 */
export function searchCategoryRecommend(
	request: SearchCategoryRecommendRequest
): Promise<SearchCategoryRecommendResponse> {
	return ectApi.get('/api/v1/categoryRecommend/search', request);
}

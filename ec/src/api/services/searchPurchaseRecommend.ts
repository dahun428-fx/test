import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchPurchaseRecommendRequest } from '@/models/api/msm/ect/purchaseRecommend/SearchPurchaseRecommendRequest';
import { SearchPurchaseRecommendResponse } from '@/models/api/msm/ect/purchaseRecommend/SearchPurchaseRecommendResponse';

/**
 * Search Purchase Recommendations Products
 * @param {SearchPurchaseRecommendRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchPurchaseRecommendResponse>} response
 */
export function searchPurchaseRecommend(
	request: SearchPurchaseRecommendRequest,
	cancelToken?: CancelToken
): Promise<SearchPurchaseRecommendResponse> {
	return ectApi.get('/api/v1/purchaseRecommend/search', request, {
		cancelToken,
	});
}

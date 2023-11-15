import { ectApi } from '@/api/clients';
import { SearchFaqRequest } from '@/models/api/msm/ect/faq/SearchFaqRequest';
import { SearchFaqResponse } from '@/models/api/msm/ect/faq/SearchFaqResponse';

/**
 * Search FAQ.
 * @param {SearchFaqRequest} request - request parameters
 * @returns {Promise<SearchFaqResponse>} response
 */
export function searchFaq(
	request: SearchFaqRequest
): Promise<SearchFaqResponse> {
	return ectApi.get('/api/v1/faq/search', request);
}

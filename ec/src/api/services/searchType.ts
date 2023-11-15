import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchTypeRequest } from '@/models/api/msm/ect/type/SearchTypeRequest';
import { SearchTypeResponse } from '@/models/api/msm/ect/type/SearchTypeResponse';

/**
 * Search types.
 * @param {SearchTypeRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchTypeResponse>} search result
 */
export function searchType(
	request: SearchTypeRequest,
	cancelToken?: CancelToken
): Promise<SearchTypeResponse> {
	return ectApi.get('/api/v1/type/search', request, { cancelToken });
}

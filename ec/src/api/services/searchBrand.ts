import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchBrandRequest } from '@/models/api/msm/ect/brand/SearchBrandRequest';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';

/**
 * Search brands.
 * @param {SearchBrandRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchBrandResponse>} search result
 */
export function searchBrand(
	request: SearchBrandRequest,
	cancelToken?: CancelToken
): Promise<SearchBrandResponse> {
	return ectApi.get('/api/v1/brand/search', request, { cancelToken });
}

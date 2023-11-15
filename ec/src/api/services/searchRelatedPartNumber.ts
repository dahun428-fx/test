import { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchRelatedPartNumberRequest } from '@/models/api/msm/ect/relatedPartNumber/SearchRelatedPartNumberRequest';
import { SearchRelatedPartNumberResponse } from '@/models/api/msm/ect/relatedPartNumber/SearchRelatedPartNumberResponse';

/**
 * Search related part number
 * @param {SearchRelatedPartNumberRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchRelatedPartNumberResponse>} response
 */
export function searchRelatedPartNumber(
	request: SearchRelatedPartNumberRequest,
	cancelToken?: CancelToken
): Promise<SearchRelatedPartNumberResponse> {
	return ectApi.get('/api/v1/relatedPartNumber/search', request, {
		cancelToken,
	});
}

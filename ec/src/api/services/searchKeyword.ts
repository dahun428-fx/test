import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchKeywordRequest } from '@/models/api/msm/ect/keyword/SearchKeywordRequest';
import { SearchKeywordResponse } from '@/models/api/msm/ect/keyword/SearchKeywordResponse';

/**
 * Search keyword.
 * @param {SearchKeywordRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchKeywordResponse>} search result
 */
export function searchKeyword(
	request: SearchKeywordRequest,
	cancelToken?: CancelToken
): Promise<SearchKeywordResponse> {
	return ectApi.get('/api/v1/keyword/search', request, { cancelToken });
}

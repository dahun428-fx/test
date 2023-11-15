import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SuggestKeywordRequest } from '@/models/api/msm/ect/keyword/SuggestKeywordRequest';
import { SuggestKeywordResponse } from '@/models/api/msm/ect/keyword/SuggestKeywordResponse';

/**
 * Suggest keyword.
 * @param {SuggestKeywordRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SuggestKeywordResponse>} search result
 */
export function suggestKeyword(
	request: SuggestKeywordRequest,
	cancelToken?: CancelToken
): Promise<SuggestKeywordResponse> {
	return ectApi.get('/api/v1/keyword/suggest', request, {
		params: { field: '@default' },
		cancelToken,
	});
}

import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchFullTextRequest } from '@/models/api/msm/ect/fullText/SearchFullTextRequest';
import { SearchFullTextResponse } from '@/models/api/msm/ect/fullText/SearchFullTextResponse';

/**
 * Search Full Text.
 * @param {SearchFullTextRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchFullTextResponse>} search result
 */
export function searchFullText(
	request: SearchFullTextRequest,
	cancelToken?: CancelToken
): Promise<SearchFullTextResponse> {
	return ectApi.get('/api/v1/fullText/search', request, { cancelToken });
}

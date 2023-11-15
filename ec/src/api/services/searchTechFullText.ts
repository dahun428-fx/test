import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchTechFullTextRequest } from '@/models/api/msm/ect/fullText/SearchTechFullTextRequest';
import { SearchTechFullTextResponse } from '@/models/api/msm/ect/fullText/SearchTechFullTextResponse';

/**
 * Search Technical information Full Text.
 * @param {SearchTechFullTextRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchTechFullTextResponse>} search result
 */
export function searchTechFullText(
	request: SearchTechFullTextRequest,
	cancelToken?: CancelToken
): Promise<SearchTechFullTextResponse> {
	return ectApi.get('/api/v1/fullText/searchTech', request, { cancelToken });
}

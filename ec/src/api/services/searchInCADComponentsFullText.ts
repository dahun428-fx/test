import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchInCADComponentsFullTextRequest } from '@/models/api/msm/ect/fullText/SearchInCADComponentsFullTextRequest';
import { SearchInCADComponentsFullTextResponse } from '@/models/api/msm/ect/fullText/SearchInCADComponentsFullTextResponse';

/**
 * Search In CAD components Full Text.
 * @param {SearchInCADComponentsFullTextRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchInCADComponentsFullTextResponse>} search result
 */
export function searchInCADComponentsFullText(
	request: SearchInCADComponentsFullTextRequest,
	cancelToken?: CancelToken
): Promise<SearchInCADComponentsFullTextResponse> {
	return ectApi.get('/api/v1/fullText/searchInCADComponents', request, {
		cancelToken,
	});
}

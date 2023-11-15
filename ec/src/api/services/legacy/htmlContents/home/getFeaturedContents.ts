import type { CancelToken } from 'axios';
import { htmlContentsApi } from '@/api/clients';
import { HtmlContentsApiRequest } from '@/models/api/legacy/htmlContents/HtmlContentsApiRequest';

/**
 * Get featured (floor) html contents
 * @param {HtmlContentsApiRequest} request
 * @param {CancelToken} [cancelToken] - cancel token
 * @returns {Promise<string>} html contents
 */
export function getFeaturedContents(
	request?: HtmlContentsApiRequest,
	cancelToken?: CancelToken
): Promise<string> {
	return htmlContentsApi.get('/operation/top/include/floors.html', request, {
		cancelToken,
	});
}

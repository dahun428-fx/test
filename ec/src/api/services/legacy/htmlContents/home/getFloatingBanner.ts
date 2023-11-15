import type { CancelToken } from 'axios';
import { cmsApi, htmlContentsApi } from '@/api/clients';
import { HtmlContentsApiRequest } from '@/models/api/legacy/htmlContents/HtmlContentsApiRequest';

/**
 * Get floating banner html contents
 * @param {HtmlContentsApiRequest} request
 * @param {CancelToken} [cancelToken] - cancel token
 * @returns {Promise<string>} html contents
 */
export async function getFloatingBanner(
	request?: HtmlContentsApiRequest,
	cancelToken?: CancelToken
): Promise<string> {
	const target = await cmsApi.get<{ a: string; b: string }>(
		'/operation/floating_bnr/json/bnr.json'
	);

	return htmlContentsApi.get(
		'/operation/floating_bnr/' + target.a + '/include/include.html',
		request,
		{
			cancelToken,
		}
	);
}

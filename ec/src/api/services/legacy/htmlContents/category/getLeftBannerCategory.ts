import type { CancelToken } from 'axios';
import { htmlContentsApi } from '@/api/clients';
import { HtmlContentsApiRequest } from '@/models/api/legacy/htmlContents/HtmlContentsApiRequest';

/**
 * Get left banner html content for category page
 * @param {string} categoryCode
 * @param {HtmlContentsApiRequest} request
 * @param {CancelToken} [cancelToken]
 * @returns
 */
export function getLeftBannerCategory(
	categoryCode: string,
	request?: HtmlContentsApiRequest,
	cancelToken?: CancelToken
): Promise<string> {
	return htmlContentsApi.get(
		`/common/include/inc_${categoryCode}_side_bottom_bnr.html`,
		request,
		{
			cancelToken,
		}
	);
}

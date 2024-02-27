import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchBannerRequest } from '@/models/api/msm/ect/banner/SearchBannerRequest';
import { SearchBannerResponse } from '@/models/api/msm/ect/banner/SearchBannerResponse';

/**
 * Search banner
 * @param {SearchBannerRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchBannerResponse>} search result
 */
export function searchBanner(
	request: SearchBannerRequest,
	cancelToken?: CancelToken
): Promise<SearchBannerResponse> {
	return ectApi.get('/api/v1/banner/search', request, { cancelToken });
}

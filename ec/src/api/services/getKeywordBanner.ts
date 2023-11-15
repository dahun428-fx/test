import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { GetKeywordBannerRequest } from '@/models/api/msm/ect/keywordBanner/GetKeywordBannerRequest';
import { GetKeywordBannerResponse } from '@/models/api/msm/ect/keywordBanner/GetKeywordBannerResponse';

/**
 * Get keyword banner
 * @param {GetKeywordBannerRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<GetOrderInfoResponse>} search result
 */
export function getKeywordBanner(
	request: GetKeywordBannerRequest,
	cancelToken?: CancelToken
): Promise<GetKeywordBannerResponse> {
	return ectApi.get('/api/v1/keywordBanner', request, { cancelToken });
}

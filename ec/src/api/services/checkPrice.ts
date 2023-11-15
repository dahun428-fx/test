import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { CheckPriceRequest } from '@/models/api/msm/ect/price/CheckPriceRequest';
import { CheckPriceResponse } from '@/models/api/msm/ect/price/CheckPriceResponse';

/**
 * Check price.
 * @param {CheckPriceRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<CheckPriceResponse>} check price response
 */
export function checkPrice(
	request: CheckPriceRequest,
	cancelToken?: CancelToken
): Promise<CheckPriceResponse> {
	return ectApi.post('/api/v1/price/check', request, { cancelToken });
}

import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SuggestPartNumberRequest } from '@/models/api/msm/ect/partNumber/SuggestPartNumberRequest';
import { SuggestPartNumberResponse } from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';

/**
 * Suggest part number.
 * @param {SuggestPartNumberRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SuggestPartNumberResponse>} search result
 */
export function suggestPartNumber(
	request: SuggestPartNumberRequest,
	cancelToken?: CancelToken
): Promise<SuggestPartNumberResponse> {
	return ectApi.get('/api/v1/partNumber/suggest', request, {
		cancelToken,
	});
}

import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SuggestComboRequest } from '@/models/api/msm/ect/combo/SuggestComboRequest';
import { SuggestComboResponse } from '@/models/api/msm/ect/combo/SuggestComboResponse';

/**
 * Suggest combo.
 * @param {SuggestComboRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SuggestComboResponse>} search result
 */
export function suggestCombo(
	request: SuggestComboRequest,
	cancelToken?: CancelToken
): Promise<SuggestComboResponse> {
	return ectApi.get('/api/v1/combo/suggest', request, {
		cancelToken,
	});
}

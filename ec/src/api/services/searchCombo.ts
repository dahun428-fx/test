import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchComboRequest } from '@/models/api/msm/ect/combo/SearchComboRequest';
import { SearchComboResponse } from '@/models/api/msm/ect/combo/SearchComboResponse';

/**
 * Search COMBO
 * @param {SearchComboRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchComboResponse>} search result
 */
export function searchCombo(
	request: SearchComboRequest,
	cancelToken?: CancelToken
): Promise<SearchComboResponse> {
	return ectApi.get('/api/v1/combo/search', request, {
		cancelToken,
	});
}

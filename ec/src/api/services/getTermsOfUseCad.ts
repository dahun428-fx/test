import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { TermsOfUseCadRequest } from '@/models/api/msm/ect/cad/TermsOfUseCadRequest';
import { TermsOfUseCadResponse } from '@/models/api/msm/ect/cad/TermsOfUseCadResponse';

/**
 * Get terms of use cad
 * @param {TermsOfUseCadRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<TermsOfUseCadResponse>} search result
 */
export function getTermsOfUseCad(
	request: TermsOfUseCadRequest,
	cancelToken?: CancelToken
): Promise<TermsOfUseCadResponse> {
	return ectApi.get('/api/v1/cad/termsOfUse', request, { cancelToken });
}

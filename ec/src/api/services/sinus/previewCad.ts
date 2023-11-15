import { CancelToken } from 'axios';
import { sinusApi } from '@/api/clients';
import { PreviewCadRequest } from '@/models/api/sinus/cad/PreviewCadRequest';
import { PreviewCadResponse } from '@/models/api/sinus/cad/PreviewCadResponse';

/**
 * Get SINUS 3D CAD preview
 * @param {PreviewCadRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<PreviewCadResponse} response
 */
export function previewCad(
	request: PreviewCadRequest,
	cancelToken?: CancelToken
): Promise<PreviewCadResponse> {
	return sinusApi.post('/sinus/api/v1/cad/preview', request, { cancelToken });
}

import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { PreviewCadRequest } from '@/models/api/msm/ect/cad/PreviewCadRequest';
import { PreviewCadResponse } from '@/models/api/msm/ect/cad/PreviewCadResponse';

/**
 * Get 3D CAD preview data
 * @param {PreviewCadRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<PreviewCadResponse} response
 */
export function previewCad(
	request: PreviewCadRequest,
	cancelToken?: CancelToken
): Promise<PreviewCadResponse> {
	return ectApi.get('/api/v1/cad/preview', request, { cancelToken });
}

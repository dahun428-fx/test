import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { DownloadCadRequest } from '@/models/api/msm/ect/cad/DownloadCadRequest';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';

/**
 * Download CAD.
 * @param {DownloadCadRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<DownloadCadResponse} download result
 */
export function downloadCad(
	request: DownloadCadRequest,
	cancelToken?: CancelToken
): Promise<DownloadCadResponse> {
	return ectApi.get('/api/v1/cad/download', request, { cancelToken });
}

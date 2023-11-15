import { CancelToken } from 'axios';
import { sinusApi } from '@/api/clients';
import { DownloadCadRequest } from '@/models/api/sinus/cad/DownloadCadRequest';
import { DownloadCadResponse } from '@/models/api/sinus/cad/DownloadCadResponse';

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
	return sinusApi.post('/sinus/api/v1/cad/download', request, { cancelToken });
}

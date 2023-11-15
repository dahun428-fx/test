import { CancelToken } from 'axios';
import { cadenasApi } from '@/api/clients';
import { GetGenerationStatusRequest } from '@/models/api/cadenas/generationStatus/GetGenerationStatusRequest';
import { GetGenerationStatusResponse } from '@/models/api/cadenas/generationStatus/GetGenerationStatusResponse';

/**
 * Check CAD file generation status and Prepare download.
 * @param {GetGenerationStatusRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<GetGenerationStatusResponse}
 */
export function getGenerationStatus(
	request: GetGenerationStatusRequest,
	cancelToken?: CancelToken
): Promise<GetGenerationStatusResponse> {
	return cadenasApi.get('/vcommon/detail/php/cad_download.php', request, {
		cancelToken,
	});
}

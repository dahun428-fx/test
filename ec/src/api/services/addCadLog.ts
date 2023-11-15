import { ectApi } from '@/api/clients';
import { AddCadLogRequest } from '@/models/api/msm/ect/cadLog/AddCadLogRequest';

/**
 * Add CAD log.
 * @param {AddCadLogRequest} request - request parameters
 */
export function addCadLog(request: AddCadLogRequest) {
	ectApi.post('/api/v1/cadLog/add', request).catch(() => {
		// noop
	});
}

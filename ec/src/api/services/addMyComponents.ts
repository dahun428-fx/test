import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { AddMyComponentsRequest } from '@/models/api/msm/ect/myComponents/AddMyComponentsRequest';
import { AddMyComponentsResponse } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';

/**
 * Add to My Components.
 *
 * @param {AddMyComponentsRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<AddMyComponentsResponse>} response
 */
export function addMyComponents(
	request: AddMyComponentsRequest,
	cancelToken?: CancelToken
): Promise<AddMyComponentsResponse> {
	return ectApi.post('/api/v1/myComponents/add', request, { cancelToken });
}

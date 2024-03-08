import { GetCustomerInfoResponse } from '@/models/api/msm/ect/customerInfo/GetCustomerInfoResponse';
import { CancelToken } from 'axios';
import { msmApi } from '@/api/clients';

/**
 * Get Customer info.
 * @param [sessionId] - session id
 * @param [cancelToken] - request cancel token
 * @returns response
 */
export function getCustomerInfo(
	sessionId?: string,
	cancelToken?: CancelToken
): Promise<GetCustomerInfoResponse> {
	const params = sessionId ? { sessionId } : undefined;
	return msmApi.get('/api/user/v1/customerInfo', {}, { cancelToken, params });
}

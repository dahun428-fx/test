import { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';

/**
 * Get user info.
 * @param [sessionId] - session id
 * @param [cancelToken] - request cancel token
 * @returns response
 */
export function getUserInfo(
	sessionId?: string,
	cancelToken?: CancelToken
): Promise<GetUserInfoResponse> {
	const params = sessionId ? { sessionId } : undefined;
	return ectApi.get('/api/v1/userInfo', {}, { cancelToken, params });
}

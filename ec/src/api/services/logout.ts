import { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { LogoutRequest } from '@/models/api/msm/ect/auth/LogoutRequest';
import { LogoutResponse } from '@/models/api/msm/ect/auth/LogoutResponse';

/**
 * logout
 * @param request - logout request
 * @param [cancelToken] - request cancel token
 * @returns logout response
 */
export function logout(
	request: LogoutRequest = {},
	cancelToken?: CancelToken
): Promise<LogoutResponse> {
	return ectApi.post('/api/v1/auth/logout', request, { cancelToken });
}

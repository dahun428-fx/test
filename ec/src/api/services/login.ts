import { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { LoginRequest } from '@/models/api/msm/ect/auth/LoginRequest';
import { LoginResponse } from '@/models/api/msm/ect/auth/LoginResponse';

/**
 * login
 * @param request - login request
 * @param [cancelToken] - request cancel token
 * @returns login response
 */
export function login(
	request: LoginRequest,
	cancelToken?: CancelToken
): Promise<LoginResponse> {
	return ectApi.post('/api/v1/auth/login', request, { cancelToken });
}

import { ectApi } from '@/api/clients';
import { CheckSessionResponse } from '@/models/api/msm/ect/auth/CheckSessionResponse';

/**
 * Check session.
 * @param sessionId - session id.
 * @returns check session response.
 */
export function checkSession(
	sessionId?: string
): Promise<CheckSessionResponse> {
	const options = sessionId ? { params: { sessionId } } : undefined;
	return ectApi.post('/api/v1/auth/check', {}, options);
}

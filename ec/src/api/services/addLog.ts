import { ectApi } from '@/api/clients';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';
import { AddLogParams, LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { AddLogRequest } from '@/models/api/msm/ect/log/AddLogRequest';
import { LogMessageMap } from '@/models/api/msm/ect/log/LogMessageMap';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Sends log message.
 * @param type - log type
 * @param message - log message
 */
export function addLog<T extends LogType>(type: T, message: LogMessageMap[T]) {
	ectApi
		.post<AddLogRequest<T>, MsmApiResponse, AddLogParams>(
			'/api/v1/log/add',
			{
				message: {
					...message,
					cookieId: getCookie(Cookie.VONA_COMMON_LOG_KEY),
				},
			},
			{
				params: { logType: type },
			}
		)
		.catch(() => {
			// no operation on log error
		});
}

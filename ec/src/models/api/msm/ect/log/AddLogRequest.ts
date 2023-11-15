import { LogType } from './AddLogParams';
import { LogMessageMap } from './LogMessageMap';
import { CommonLogMessage } from './message';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

export interface AddLogRequest<T extends LogType> extends MsmApiRequest {
	message: LogMessageMap[T] & CommonLogMessage;
}

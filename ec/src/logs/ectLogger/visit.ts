import { addLog } from '@/api/services/addLog';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { VisitLogMessage } from '@/models/api/msm/ect/log/message';
import { normalizeUrl } from '@/utils/url';

/**
 * Send visit page log
 * @param payload
 */
export function sendVisitLog(payload: VisitLogMessage = {}) {
	addLog(LogType.VISIT, {
		...payload,
		classCode: payload.classCode ?? window.sc_class_cd ?? 'other',
		url: normalizeUrl(location.href),
	});
}

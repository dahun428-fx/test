// utils/datadogRUM/logger.ts は utils/datadog/logger.ts にしたい。

import type { LogsEvent } from '@datadog/browser-logs';
import { config } from '@/config';

const shouldForwardError = (log: LogsEvent) =>
	!log.http?.url?.includes('sessionId=') &&
	!log.http?.url?.startsWith(`${config.api.ect.origin}/api/`) &&
	!log.http?.url?.startsWith(`${config.api.auth.origin}/api`) &&
	!log.http?.url?.startsWith(`${config.api.sinus.origin}/`) &&
	!log.http?.url?.startsWith(
		`${config.api.cadenas.origin}/vcommon/detail/php/cad`
	) &&
	!log.http?.url?.startsWith(`${config.api.cameleer.origin}/`);

// beforeSend for datadogLogs.init() config
export const beforeSend = (log: LogsEvent) =>
	shouldForwardError(log) ? undefined : false;

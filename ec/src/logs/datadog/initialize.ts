import { datadogLogs } from '@datadog/browser-logs';
import { GlobalContext } from './types';
import { getHandler } from './utils';
import { config } from '@/config';
import { beforeSend } from '@/utils/datadogRUM/logger';

const { clientToken, site, service, env, sampleRate } = config.datadogRUM;

export function clientLoggerInitializer(target: 'pc' | 'mobile') {
	// NOTE: SS では初期化処理は行わない
	if (typeof window === 'undefined') {
		return;
	}

	// initialize datadog logs
	datadogLogs.init({
		clientToken,
		site,
		service,
		env,
		sampleRate,
		forwardErrorsToLogs: true,
		beforeSend,
	});

	const context: GlobalContext = {
		buildTarget: target,
		// env, system, ...?
	};
	datadogLogs.setLoggerGlobalContext(context);
	datadogLogs.logger.setHandler(getHandler());
	if (process.env.NODE_ENV === 'production') {
		datadogLogs.logger.setLevel('warn');
	}
}

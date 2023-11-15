import {
	datadogRum,
	RumFetchResourceEventDomainContext,
} from '@datadog/browser-rum';
import { config } from '@/config';

/**
 * datadog RUMを初期化する
 */
export function datadogRumInitializer(target: 'pc' | 'mobile') {
	if (
		process.env.NODE_ENV === 'production' &&
		config.datadogRUM.applicationId &&
		typeof window !== 'undefined'
	) {
		// 本番起動かつapplicationIDに正常値が入っている場合

		// buildID取得
		const NEXT_DATA = document.querySelector('#__NEXT_DATA__')?.textContent;
		const buildId = NEXT_DATA ? JSON.parse(NEXT_DATA).buildId : undefined;

		datadogRum.init({
			applicationId: config.datadogRUM.applicationId,
			clientToken: config.datadogRUM.clientToken,
			site: config.datadogRUM.site,
			service: config.datadogRUM.service,
			env: config.datadogRUM.env,
			sampleRate: config.datadogRUM.sampleRate,
			trackInteractions: config.datadogRUM.trackInteractions,
			defaultPrivacyLevel: config.datadogRUM.defaultPrivacyLevel,
			version: buildId,
			beforeSend: (event, context) => {
				if (event.type === 'resource' && event.resource.type === 'fetch') {
					// NOTE: It is implemented using typecasting because the data type changes dynamically depending on the event type in Datadog RUM.
					const headers = (context as RumFetchResourceEventDomainContext)
						.response?.headers;
					// get vercel request id from response header
					// The "requestId" mentioned here is output as a log in Vercel's SSR processing and is equivalent to the "proxy/requestId" item.
					// It can be used to link Datadog RUM resource monitoring with SSR processing logs.
					// see: https://vercel.com/docs/concepts/edge-network/headers#x-vercel-id-res
					const vercelProxyRequestId = headers?.get('x-vercel-id');
					if (vercelProxyRequestId) {
						event.context = {
							...event.context,
							vercelProxyRequestId,
						};
					}
				}
			},
		});
		datadogRum.addRumGlobalContext('buildTarget', target);
		datadogRum.startSessionReplayRecording();
	}
}

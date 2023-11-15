import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';

/** Log event type */
export type QuoteEvent = {
	event: 'gaProductsWosDirectEstimate';
	cd_088: '[c_cart]StartEstimate_wos';
	cm_132: 1;
	cm_200: 1;
};

/**
 * "Quote on WOS" log
 */
export function quote() {
	EventManager.submit(() => {
		sendEvent<QuoteEvent>({
			event: 'gaProductsWosDirectEstimate',
			cd_088: '[c_cart]StartEstimate_wos',
			cm_132: 1,
			cm_200: 1,
		});
	});
}

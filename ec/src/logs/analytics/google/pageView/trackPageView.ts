import { EventManager } from '@/logs/analytics/google/EventManager';
import { routerHistory } from '@/utils/routerHistory';

/**
 * Send track page view for GA.
 * Needs setting global variables before call this function.
 *
 * NOTE: Promise is returned, but do not return in wrapper if not needed.
 */
export function trackPageView() {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: 'gaDisplay',
		dl_referrer: routerHistory.referrer(),
	});
	EventManager.ready();
}

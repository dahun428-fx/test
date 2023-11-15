import { routerHistory } from '@/utils/routerHistory';
import { sleep } from '@/utils/timer';

const DELAY_OF_RETRY = 500; // ms
const MAX_RETRY_COUNT = 30;

/**
 * Send track page view for AA.
 * Needs setting global variables before call this function.
 *
 * NOTE: Promise is returned, but do not return in wrapper if not needed.
 */
export async function trackPageView(retry = 0) {
	if (window.sc_f_spascreen_display) {
		try {
			window.sc_f_spascreen_display(routerHistory.referrer());
		} catch {
			// Give up tracking
		}
	} else if (retry < MAX_RETRY_COUNT) {
		// wait for AA tag loaded
		await sleep(DELAY_OF_RETRY);
		await trackPageView(retry + 1);
	} else {
		// Give up tracking
	}
}

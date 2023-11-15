import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';

export async function trackMakerListView() {
	clearVariables();
	trackPageView().then();
}

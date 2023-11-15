import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';

/**
 * Track Not Found Page View
 */
export const useTrackPageView = () => {
	useOnMounted(() => {
		ga.pageView.notFound();
	});
};

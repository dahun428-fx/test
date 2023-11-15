import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';

/** Track page view hook */
export const useTrackPageView = () => {
	useOnMounted(() => {
		ga.pageView.error();
	});
};

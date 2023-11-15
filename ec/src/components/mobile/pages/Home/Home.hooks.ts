import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';

/**
 * Track Top Page View
 */
export const useTrackPageView = () => {
	useOnMounted(() => {
		ectLogger.visit({ classCode: ClassCode.TOP });
		aa.pageView.top().then();
		ga.pageView.top().then();
	});
};

import { useCallback, useState } from 'react';
import { getFeaturedContents } from '@/api/services/legacy/htmlContents/home/getFeaturedContents';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';

export const useFeaturedContents = () => {
	const [featuredContents, setFeaturedContents] = useState<string>();
	const [loading, startToLoad, endLoading] = useBoolState(false);

	const load = useCallback(async () => {
		startToLoad();
		try {
			const response = await getFeaturedContents();
			setFeaturedContents(response);
		} catch (error) {
			// even if could get SSI content or not , it will be passed here
		} finally {
			endLoading();
		}
	}, [endLoading, startToLoad]);

	useOnMounted(load);

	return { featuredContents, loading };
};

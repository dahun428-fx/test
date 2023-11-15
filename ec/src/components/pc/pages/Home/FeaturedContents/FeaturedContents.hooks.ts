import { useCallback, useState } from 'react';
import { getFeaturedContents } from '@/api/services/legacy/htmlContents/home/getFeaturedContents';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';

export const useFeaturedContents = () => {
	const [featuredContents, setFeaturedContents] = useState<string>();
	const [loading, setLoading] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			setFeaturedContents(await getFeaturedContents());
		} catch (error) {
			// SSI コンテンツは取得できなくても握り潰す
		} finally {
			setLoading(false);
		}
	}, []);

	useOnMounted(load);

	return { featuredContents, loading };
};

import { useCallback, useState } from 'react';
import { getPopularBrand } from '@/api/services/legacy/cms/home/getPopularBrand';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetPopularBrandResponse } from '@/models/api/cms/home/GetPopularBrandResponse';

export const usePopularBrandList = () => {
	const [popularBrand, setPopularBrand] = useState<GetPopularBrandResponse>();
	const [loading, setLoading] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getPopularBrand();
			setPopularBrand(response);
		} catch (error) {
			// SSI コンテンツは取得できなくても握り潰す
		} finally {
			setLoading(false);
		}
	}, []);

	useOnMounted(load);

	return { popularBrand, loading };
};

import { useSelector } from '@/store/hooks';
import { selectSeriesResponse } from '@/store/modules/pages/category';

export const useMakerCategory = () => {
	const seriesResponse = useSelector(selectSeriesResponse);

	return { seriesResponse };
};

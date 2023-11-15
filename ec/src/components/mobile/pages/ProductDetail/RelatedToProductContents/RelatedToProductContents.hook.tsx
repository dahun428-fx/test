import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const useSeries = (): Series | null => {
	const series = useSelector(selectSeries);
	return series;
};

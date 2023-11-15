import { useCallback, useState } from 'react';
import { RadarChartRecommend as Presenter } from './RadarChartRecommend';
import { getRadarChartRecommend } from '@/api/services/cameleer/getRadarChartRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetRadarChartRecommendResponse } from '@/models/api/cameleer/radarChartRecommend/GetRadarChartRecommendResponse';

export const RadarChartRecommend: React.VFC = () => {
	const [radarChartRecommend, setRadarChartRecommend] =
		useState<GetRadarChartRecommendResponse | null>();

	const load = useCallback(async () => {
		try {
			const radarChartRecommendResponse = await getRadarChartRecommend();
			setRadarChartRecommend(radarChartRecommendResponse);
		} catch (error) {
			// Noop
		}
	}, []);

	useOnMounted(load);

	if (
		!radarChartRecommend ||
		(radarChartRecommend.recommendItems?.length ?? 0) === 0
	) {
		return null;
	}

	return <Presenter radarChartRecommend={radarChartRecommend} />;
};

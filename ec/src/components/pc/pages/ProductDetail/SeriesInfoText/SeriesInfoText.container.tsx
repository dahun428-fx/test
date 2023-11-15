import React from 'react';
import { SeriesInfoText as Presenter } from '@/components/pc/domain/series/SeriesInfoText';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const SeriesInfoText: React.VFC = () => {
	const { seriesInfoText } = useSelector(selectSeries);

	if (!seriesInfoText?.length) {
		return null;
	}

	return <Presenter seriesInfoText={seriesInfoText} />;
};
SeriesInfoText.displayName = 'SeriesInfoText';

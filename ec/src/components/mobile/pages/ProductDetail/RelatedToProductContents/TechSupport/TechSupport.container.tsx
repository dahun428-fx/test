import React from 'react';
import { TechSupport as Presenter } from './TechSupport';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

/** Tech support container */
export const TechSupport: React.VFC = () => {
	const series = useSelector(selectSeries);

	return <Presenter contact={series.contact} seriesCode={series.seriesCode} />;
};
TechSupport.displayName = 'TechSupport';

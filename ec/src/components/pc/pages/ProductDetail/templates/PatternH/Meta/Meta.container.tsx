import React from 'react';
import { Meta as Presenter } from './Meta';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

/**
 * Simple Meta container
 */
export const Meta: React.VFC = () => {
	const series = useSelector(selectSeries);
	const { seriesName, brandName, seriesCode, departmentCode } = series;
	return (
		<Presenter
			seriesName={seriesName}
			brandName={brandName}
			seriesCode={seriesCode}
			departmentCode={departmentCode}
		/>
	);
};
Meta.displayName = 'Meta';

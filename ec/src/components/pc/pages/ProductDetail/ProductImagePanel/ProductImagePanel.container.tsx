import React from 'react';
import { ProductImagePanel as Presenter } from './ProductImagePanel';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const ProductImagePanel: React.VFC = () => {
	const series = useSelector(selectSeries);

	return (
		<Presenter
			seriesName={series.seriesName}
			productImageList={series.productImageList}
		/>
	);
};
ProductImagePanel.displayName = 'ProductImagePanel';

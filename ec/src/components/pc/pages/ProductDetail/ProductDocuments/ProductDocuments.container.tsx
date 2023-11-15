import React from 'react';
import { ProductDocuments as Presenter } from './ProductDocuments';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const ProductDocuments: React.VFC = () => {
	const series = useSelector(selectSeries);
	return <Presenter {...series} />;
};
ProductDocuments.displayName = 'ProductDocuments';

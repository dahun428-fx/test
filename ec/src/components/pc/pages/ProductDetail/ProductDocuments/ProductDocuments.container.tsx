import React from 'react';
import { ProductDocuments as Presenter } from './ProductDocuments';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { CatalogLinkTitle } from '../CatalogLink';

export const ProductDocuments: React.VFC<CatalogLinkTitle> = ({
	linkTitle,
}) => {
	const series = useSelector(selectSeries);
	return <Presenter series={series} linkTitle={linkTitle} />;
};
ProductDocuments.displayName = 'ProductDocuments';

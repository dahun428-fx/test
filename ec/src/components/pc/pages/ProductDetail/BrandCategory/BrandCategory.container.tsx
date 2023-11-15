import React from 'react';
import { BrandCategory as Presenter } from './BrandCategory';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

type Props = {
	displayCategoryLink?: boolean;
};

export const BrandCategory: React.VFC<Props> = ({
	displayCategoryLink = true,
}) => {
	const series = useSelector(selectSeries);
	return <Presenter {...{ ...series, displayCategoryLink }} />;
};
BrandCategory.displayName = 'BrandCategory';

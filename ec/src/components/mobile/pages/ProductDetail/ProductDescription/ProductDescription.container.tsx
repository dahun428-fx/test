import React from 'react';
import { ProductDescription as Presenter } from './ProductDescription';
import { TabType } from '@/models/api/msm/ect/series/shared';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const ProductDescription: React.VFC = () => {
	const { catchCopy, seriesInfoText, productDescriptionHtml, tabType } =
		useSelector(selectSeries);
	const electoricalTabTypeSet = new Set<TabType>([
		TabType.ELE_A,
		TabType.ELE_B,
	]);
	const hasProductDescription =
		!!catchCopy ||
		!!seriesInfoText?.length ||
		(!!productDescriptionHtml && electoricalTabTypeSet.has(tabType));

	if (!hasProductDescription) {
		return null;
	}

	return (
		<Presenter
			catchCopy={catchCopy}
			seriesInfoText={seriesInfoText}
			productDescriptionHtml={productDescriptionHtml}
			tabType={tabType}
		/>
	);
};
ProductDescription.displayName = 'ProductDescription';

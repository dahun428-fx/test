import React, { memo } from 'react';
import { DiscontinuedAsideCell } from './DiscontinuedAsideCell.container';
import { NoListedProductCell } from './NoListedProductCell';
import { NormalProductCell } from './NormalProductCell';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	type: Series;
	index: number;
};

export const ProductAsideCells = memo<Props>(({ type, index }) => {
	switch (type.seriesStatus) {
		case SeriesStatus.NORMAL:
			return <NormalProductCell type={type} />;
		case SeriesStatus.UNLISTED:
			return <NoListedProductCell type={type} />;
		case SeriesStatus.DISCONTINUED:
			return <DiscontinuedAsideCell {...type} index={index} />;
	}
});
ProductAsideCells.displayName = 'ProductAsideCells';

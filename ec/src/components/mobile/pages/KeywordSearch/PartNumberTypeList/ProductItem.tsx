import React, { memo } from 'react';
import { DiscontinuedProduct } from './DiscontinuedProduct';
import { NoListedProduct } from './NoListedProduct';
import { NormalProduct } from './NormalProduct';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	series: Series;
	currencyCode?: string;
	displayType: DisplayTypeOption;
	keyword: string;
	index: number;
	onClick: (rowIndex: number) => void;
	onClickAlternativeLink: (href: string, index: number) => void;
};

/** Product item component */
export const ProductItem = memo<Props>(
	({
		series,
		currencyCode,
		displayType,
		keyword,
		index,
		onClick,
		onClickAlternativeLink,
	}) => {
		switch (series.seriesStatus) {
			case SeriesStatus.NORMAL:
				return (
					<NormalProduct
						series={series}
						currencyCode={currencyCode}
						displayType={displayType}
						keyword={keyword}
						index={index}
						onClick={onClick}
					/>
				);
			case SeriesStatus.UNLISTED:
				return <NoListedProduct displayType={displayType} series={series} />;
			case SeriesStatus.DISCONTINUED:
				return (
					<DiscontinuedProduct
						series={series}
						displayType={displayType}
						onClickAlternativeLink={onClickAlternativeLink}
					/>
				);
		}
	}
);

ProductItem.displayName = 'ProductItem';

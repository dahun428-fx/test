import React, { VFC } from 'react';
import { ListItem } from './ListItem';
import { PhotoItem } from '@/components/mobile/pages/KeywordSearch/SeriesList/SeriesTile/PhotoItem';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ectLogger } from '@/logs/ectLogger';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { url } from '@/utils/url';

export type CategoryLinkData = {
	categoryName: string;
	categoryUrl: string;
};

type Props = {
	displayType: DisplayTypeOption;
	image: {
		url: string;
		comment?: string;
	};
	series: Series;
	currencyCode?: string;
	seriesUrl: string;
	keyword: string;
	isReSearch?: string;
	index: number;
};

/** Series tile component */
export const SeriesTile: VFC<Props> = ({
	displayType,
	keyword,
	isReSearch,
	series,
	currencyCode,
	index,
	seriesUrl,
	image,
}) => {
	const handleClick = () => {
		ectLogger.searchResult.clickSeriesLink({
			keyword,
			isReSearch,
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			forwardPageUrl: url
				.productDetail(series.seriesCode)
				.fromKeywordSearch(keyword)
				.seriesList(),
			forwardPageUrlDispNo: String(index + 1),
		});

		ga.ecommerce.selectItem({
			seriesCode: series.seriesCode,
			itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
		});
	};

	if (displayType === DisplayTypeOption.LIST) {
		return (
			<ListItem
				image={image}
				series={series}
				currencyCode={currencyCode}
				seriesUrl={seriesUrl}
				onClick={handleClick}
			/>
		);
	}
	return (
		<PhotoItem
			image={image}
			series={series}
			currencyCode={currencyCode}
			seriesUrl={seriesUrl}
			onClick={handleClick}
		/>
	);
};

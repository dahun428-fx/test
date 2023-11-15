import React, { VFC, useMemo } from 'react';
import { SeriesTile as Presenter } from './SeriesTile';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { pagesPath } from '@/utils/$path';
import { convertToURLString } from '@/utils/url';

type Props = {
	series: Series;
	currencyCode?: string;
	keyword: string;
	displayType: DisplayTypeOption;
	index: number;
	isReSearch?: string;
};

/** Series tile container */
export const SeriesTile: VFC<Props> = ({
	displayType,
	series,
	currencyCode,
	keyword,
	index,
	isReSearch,
}) => {
	const seriesUrl = pagesPath.vona2.detail._seriesCode(series.seriesCode).$url({
		query: {
			KWSearch: keyword,
			searchFlow: 'results2products',
			list: ItemListName.KEYWORD_SEARCH_RESULT,
		},
	});

	const firstImage = useMemo(() => {
		if (series.productImageList.length === 0) {
			return { url: '', comment: '' };
		}
		return {
			url: series.productImageList[0]?.url ?? '',
			comment: series.productImageList[0]?.comment ?? '',
		};
	}, [series.productImageList]);

	return (
		<Presenter
			index={index}
			keyword={keyword}
			isReSearch={isReSearch}
			displayType={displayType}
			image={firstImage}
			series={series}
			currencyCode={currencyCode}
			seriesUrl={convertToURLString(seriesUrl)}
		/>
	);
};

SeriesTile.displayName = 'SeriesTile';

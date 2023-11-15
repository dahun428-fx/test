import React, { MouseEvent, useMemo } from 'react';
import { ListItem } from './ListItem';
import { PhotoItem } from './PhotoItem';
import { Option } from '@/components/pc/ui/controls/select/DisplayTypeSwitch';
import { config } from '@/config';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { CadType } from '@/models/api/constants/CadType';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { pagesPath } from '@/utils/$path';
import { convertToURLString, url } from '@/utils/url';

export type Props = {
	series: Series;
	currencyCode?: string;
	keyword: string;
	displayType?: Option;
	index: number;
	isReSearch?: string;
};

/**
 * シリーズ検索結果のタイル（リストで表示）
 */
export const SeriesTile: React.VFC<Props> = React.memo(
	({ series, currencyCode, keyword, displayType, index, isReSearch }) => {
		const seriesUrl = pagesPath.vona2.detail
			._seriesCode(series.seriesCode)
			.$url({
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

		// c-value product or not (C-Value製品かどうか)
		const isCValueProduct = Flag.isTrue(series.cValueFlag);

		const linkUrlForCadType = (cadType?: string) => {
			const cadTypeCode =
				cadType === CadType['2D']
					? '01'
					: cadType === CadType['3D']
					? '10'
					: '';

			return pagesPath.vona2.detail._seriesCode(series.seriesCode).$url({
				query: {
					KWSearch: keyword ?? '',
					searchFlow: 'results2products',
					list: ItemListName.KEYWORD_SEARCH_RESULT,
					CAD: cadTypeCode,
				},
			});
		};

		const handleClick = (event: MouseEvent) => {
			event.preventDefault();
			window.open(convertToURLString(seriesUrl));
			ga.ecommerce.selectItem({
				seriesCode: series.seriesCode,
				itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
			});
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
		};

		const handleClickBreadcrumb = (categoryUrl: string) => {
			ectLogger.searchResult.clickSeriesBreadcrumb({
				keyword,
				isReSearch,
				forwardPageUrl: `${config.web.ec.origin}${categoryUrl}`,
				forwardPageUrlDispNo: String(index + 1),
			});
		};

		return displayType === Option.PHOTO ? (
			<PhotoItem
				isCValueProduct={isCValueProduct}
				image={firstImage}
				series={series}
				currencyCode={currencyCode}
				linkUrlForCadType={linkUrlForCadType}
				seriesUrl={convertToURLString(seriesUrl)}
				onClick={handleClick}
			/>
		) : (
			<ListItem
				isCValueProduct={isCValueProduct}
				image={firstImage}
				series={series}
				currencyCode={currencyCode}
				linkUrlForCadType={linkUrlForCadType}
				seriesUrl={convertToURLString(seriesUrl)}
				onClick={handleClick}
				onClickBreadcrumb={handleClickBreadcrumb}
			/>
		);
	}
);
SeriesTile.displayName = 'SeriesTile';

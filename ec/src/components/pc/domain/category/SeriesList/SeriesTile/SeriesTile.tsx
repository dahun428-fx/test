import React, { MouseEvent, useMemo } from 'react';
import { ListItem } from './ListItem';
import { PhotoItem } from './PhotoItem';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { Option } from '@/components/pc/ui/controls/select/DisplayTypeSwitch';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { Spec } from '@/models/api/msm/ect/series/shared';
import { pagesPath } from '@/utils/$path';
import { convertCadTypeToQueryParameter } from '@/utils/domain/category';
import { convertToURLString } from '@/utils/url';

type Props = {
	displayType?: Option;
	series: Series;
	currencyCode?: string;
	specList: Spec[];
};

/** Series Tile component */
export const SeriesTile: React.VFC<Props> = ({
	displayType,
	series,
	currencyCode,
	specList,
}) => {
	const { conditions } = useSpecSearchContext();
	const seriesUrl = pagesPath.vona2.detail._seriesCode(series.seriesCode).$url({
		query: conditions,
	});

	const isCValueProduct = Flag.isTrue(series.cValueFlag);

	const firstImage = useMemo(() => {
		if (series.productImageList.length === 0) {
			return { url: '', comment: '' };
		}
		return {
			url: series.productImageList[0]?.url ?? '',
			comment: series.productImageList[0]?.comment ?? '',
		};
	}, [series.productImageList]);

	const specTableTypeC = useMemo(() => {
		return specList.filter(spec => spec.specType === '1');
	}, [specList]);

	const linkUrlForCadType = (cadType?: string) => {
		const cadTypeCode = convertCadTypeToQueryParameter(cadType);

		return pagesPath.vona2.detail._seriesCode(series.seriesCode).$url({
			query: {
				CAD: cadTypeCode,
			},
		});
	};

	const handleClick = (event: MouseEvent) => {
		event.preventDefault();

		ga.ecommerce.selectItem({
			seriesCode: series.seriesCode,
			itemListName: ItemListName.PAGE_CATEGORY,
		});

		window.open(
			`${convertToURLString({
				...seriesUrl,
				query: { ...seriesUrl.query, list: ItemListName.PAGE_CATEGORY },
			})}`
		);
	};

	return displayType === Option.PHOTO ? (
		<PhotoItem
			isCValueProduct={isCValueProduct}
			image={firstImage}
			series={series}
			currencyCode={currencyCode}
			seriesUrl={convertToURLString(seriesUrl)}
			linkUrlForCadType={linkUrlForCadType}
			onClick={handleClick}
		/>
	) : (
		<ListItem
			series={series}
			currencyCode={currencyCode}
			image={firstImage}
			isCValueProduct={isCValueProduct}
			specList={specTableTypeC}
			seriesUrl={convertToURLString(seriesUrl)}
			linkUrlForCadType={linkUrlForCadType}
			onClick={handleClick}
		/>
	);
};
SeriesTile.displayName = 'SeriesTile';

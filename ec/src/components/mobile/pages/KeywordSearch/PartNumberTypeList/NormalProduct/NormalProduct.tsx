import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from './List';
import { Photo } from './Photo';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { pagesPath } from '@/utils/$path';
import { getSeriesNameDisp } from '@/utils/domain/series';

type Props = {
	series: Series;
	currencyCode?: string;
	displayType: DisplayTypeOption;
	keyword: string;
	index: number;
	onClick: (rowIndex: number) => void;
};

/** Normal product component */
export const NormalProduct: React.VFC<Props> = ({
	series,
	currencyCode,
	displayType,
	keyword,
	index,
	onClick,
}) => {
	const [t] = useTranslation();

	const getSeriesInfo = useCallback(
		(series: Series) => {
			const seriesName = Flag.isTrue(series.packageSpecFlag)
				? series.seriesName
				: getSeriesNameDisp(series, t);

			const query = {
				KWSearch: keyword,
				searchFlow: 'results2products',
				list: ItemListName.KEYWORD_SEARCH_RESULT,
			};

			const partNumberLink = pagesPath.vona2.detail
				._seriesCode(series.seriesCode)
				.$url({
					query: {
						...query,
						PNSearch: series.partNumber,
						HissuCode: series.partNumber,
					},
				});

			const seriesImage = {
				url: series.productImageList[0]?.url ?? '',
				comment: series.productImageList[0]?.comment ?? '',
			};

			return { seriesName, seriesImage, partNumberLink };
		},
		[keyword, t]
	);

	const handleClick = useCallback(() => {
		onClick(index);
	}, [index, onClick]);

	return displayType === DisplayTypeOption.LIST ? (
		<List
			key={index}
			{...{ ...getSeriesInfo(series) }}
			series={series}
			currencyCode={currencyCode}
			onClick={handleClick}
		/>
	) : (
		<Photo
			key={index}
			{...{ ...getSeriesInfo(series) }}
			series={series}
			currencyCode={currencyCode}
			onClick={handleClick}
		/>
	);
};

NormalProduct.displayName = 'NormalProduct';

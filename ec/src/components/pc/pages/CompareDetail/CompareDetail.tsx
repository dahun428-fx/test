import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { CompareItem } from '@/models/localStorage/Compare';
import { selectCompare } from '@/store/modules/common/compare';
import { assertNotEmpty } from '@/utils/assertions';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export type Props = {
	categoryCode: string;
};

export const CompareDetail: React.FC<Props> = ({ categoryCode }) => {
	const compare = useSelector(selectCompare);

	const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

	useEffect(() => {
		if (!!compare && compare.items.length > 0) {
			console.log('compare ===> ', compare);
			const items = compare.items.filter(
				item => item.categoryCode === categoryCode
			);
			setCompareItems(items);
		}
	}, [compare.items]);

	type resultType = {
		partNumberResponse: SearchPartNumberResponse$search;
		seriesResponse: SearchSeriesResponse$detail;
	};
	useEffect(() => {
		if (compareItems.length < 1) return;
		// setCompareItems(items);
		const seriesCode = compareItems[0]?.seriesCode;
		const partNumber = compareItems[0]?.partNumber;
		try {
			(async () => {
				console.log(
					'seriesCode ===> ',
					seriesCode,
					'partNumber===>',
					partNumber
				);
				assertNotEmpty(seriesCode);
				assertNotEmpty(partNumber);

				const [partNumberResponse, seriesResponse] = await Promise.all([
					searchPartNumber$search({
						seriesCode,
						partNumber,
					}),
					searchSeries$detail({
						seriesCode,
					}),
				]);
				console.log('res ===> ', partNumberResponse, seriesResponse);

				const { specList, partNumberList, currencyCode } = partNumberResponse;
				const { seriesList } = seriesResponse;
				console.log('specList ===> ', specList);
				console.log('partNumberList ===> ', partNumberList);
				console.log('seriesList ===> ', seriesList);
				console.log('currencyCode ===> ', currencyCode);
			})();
		} catch (error) {
			console.log('error =====> ', error);
		}
	}, [compareItems]);

	return (
		<div>
			{compareItems &&
				compareItems.length > 0 &&
				compareItems.map((item, index) => {
					return (
						<div key={index}>
							{item.categoryCode1}
							<span>{item.partNumber}</span>
						</div>
					);
				})}
		</div>
	);
};
CompareDetail.displayName = 'CompareDetail';

import { Button } from '@/components/pc/ui/buttons';
import { ModalOpener, ModalProvider } from '@/components/pc/ui/modals';
import { CompareItem } from '@/models/localStorage/Compare';
import { useSelector } from '@/store/hooks';
import {
	addItemOperation,
	selectCompare,
	updateCompareOperation,
	updateShowsCompareBalloonStatusOperation,
} from '@/store/modules/common/compare';
import { useDispatch } from 'react-redux';
import {
	selectCategoryCodeList,
	selectCompletedPartNumber,
	selectPartNumber,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { getBreadcrumbList } from '@/utils/domain/category';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getCompare, updateCompare } from '@/services/localStorage/compare';
import dayjs from 'dayjs';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	partNumber: string;
	// categoryName?: string;
	// seriesCode: string;
	// brandCode: string;
	// innerCode?: string;
};

const COMPARE_HEAD_MAX_LENGTH = 3;
const COMPARE_CONTENT_MAX_LENGTH = 5;

export const CompareProductButton: FC<Props> = ({
	partNumber,
	// categoryName,
	// seriesCode,
	// brandCode,
}) => {
	const [compareList, setCompareList] = useState<Set<CompareItem>>(
		new Set<CompareItem>()
	);

	const series = useSelector(selectSeries);
	// const categoryCodeList = useSelector(selectCategoryCodeList);
	// const partNumber = useSelector(selectCompletedPartNumber);
	const dispatch = useDispatch();

	const compare = useSelector(selectCompare);

	const createParam = (series: Series): CompareItem => {
		const categoryCode = series.categoryCode;
		const categoryList = series.categoryList;
		const categoryName = series.categoryName;
		const seriesName = series.seriesName;
		const seriesCode = series.seriesCode;
		const brandCode = series.brandCode;
		const brandName = series.brandName;
		const productImageUrl = series.productImageList[0]?.url || '';
		assertNotNull(categoryCode);
		assertNotNull(categoryName);
		return {
			categoryCode,
			categoryName,
			seriesCode,
			seriesName,
			brandCode,
			brandName,
			productImageUrl,
			partNumber,
			categoryCode1: categoryList[1]?.categoryCode || 'other',
			categoryName1: categoryList[1]?.categoryName || 'other',
			categoryCode2: categoryList[2]?.categoryCode || 'other',
			categoryName2: categoryList[2]?.categoryName || 'other',
			categoryCode3: categoryList[3]?.categoryCode || 'other',
			categoryName3: categoryList[3]?.categoryName || 'other',
			categoryCode4: categoryList[4]?.categoryCode || 'other',
			categoryName4: categoryList[4]?.categoryName || 'other',
			categoryCode5: categoryList[5]?.categoryCode || 'other',
			categoryName5: categoryList[5]?.categoryName || 'other',
			expire: dayjs()
				.add(1, 'day')
				.set('hour', 0)
				.set('minute', 0)
				.set('second', 0)
				.toDate()
				.toUTCString(),
			isPu: false,
		};
	};

	const hasItem = (compareItem: CompareItem) => {
		const foundIndex = Array.from(compareList).findIndex(item => {
			if (
				item.seriesCode === compareItem.seriesCode &&
				item.partNumber === compareItem.partNumber
			) {
				return item;
			}
		});
		return foundIndex === -1 ? false : true;
	};

	const tabHeadLength: number = useMemo(() => {
		const categoryCodeList = compare.items.map(item => item.categoryCode);
		return categoryCodeList.reduce<string[]>(
			(previous, current) =>
				previous.includes(current) ? previous : [current, ...previous],
			[]
		).length;
	}, [compare.items]);

	const tabContentLength = useCallback(
		(categoryCode: string): number => {
			return compare.items.filter(item => {
				if (item.categoryCode === categoryCode) {
					return item;
				}
			}).length;
		},
		[compare.items]
	);

	const handleClick = () => {
		if (tabHeadLength >= COMPARE_HEAD_MAX_LENGTH) {
			return;
		}
		const compareItem = createParam(series);
		console.log('tabHeadLength ===> ', tabHeadLength);
		console.log(
			'tabContentLength ===> ',
			compareItem.categoryCode,
			tabContentLength(compareItem.categoryCode)
		);

		if (
			tabContentLength(compareItem.categoryCode) >= COMPARE_CONTENT_MAX_LENGTH
		) {
			return;
		}

		if (!hasItem(compareItem)) {
			addItemOperation(dispatch)(compareItem);
		} else {
			updateCompareOperation(dispatch)({
				...compare,
				active: compareItem.categoryCode,
			});
			updateCompare({ active: compareItem.categoryCode });
		}
		updateShowsCompareBalloonStatusOperation(dispatch)(true);
	};

	useEffect(() => {
		setCompareList(new Set(compare.items));
	}, [compare.items]);

	return (
		<>
			<Button
				type="button"
				theme="default-sub"
				size="m"
				icon="compare"
				onClick={handleClick}
			>
				비교
			</Button>
		</>
	);
};
CompareProductButton.displayName = 'CompareProductButton';

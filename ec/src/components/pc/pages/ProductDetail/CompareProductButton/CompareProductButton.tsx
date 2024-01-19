import { Button } from '@/components/pc/ui/buttons';
import { ModalOpener, ModalProvider } from '@/components/pc/ui/modals';
import { CompareCookiesItem } from '@/models/localStorage/CompareCookies';
import { useSelector } from '@/store/hooks';
import {
	addItemOperation,
	selectCompareCookies,
} from '@/store/modules/common/compare';
import { useDispatch } from 'react-redux';
import {
	selectCategoryCodeList,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { getBreadcrumbList } from '@/utils/domain/category';
import { FC, useEffect, useState } from 'react';
import { getCompareCookies } from '@/services/localStorage/compare';

type Props = {
	partNumber: string;
	categoryName?: string;
	seriesCode: string;
	brandCode: string;
	innerCode?: string;
	categoryCodeList: string[];
};

export const CompareProductButton: FC<Props> = ({
	partNumber,
	categoryName,
	seriesCode,
	brandCode,
	innerCode,
	// categoryCodeList,
}) => {
	const [compareCookiesList, setCompareCookiesList] = useState<
		Set<CompareCookiesItem>
	>(new Set<CompareCookiesItem>());

	const categoryCodeList = useSelector(selectCategoryCodeList);
	const series = useSelector(selectSeries);
	const dispatch = useDispatch();

	const compareCookies = useSelector(selectCompareCookies);

	console.log(categoryCodeList);
	const handleClick = () => {
		const categoryCode = series.categoryCode;
		const categoryList = series.categoryList;

		if (!categoryCode || categoryCodeList.length < 1) {
			return;
		}

		const data: CompareCookiesItem = {
			categoryCode,
			seriesCode,
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
			expire: new Date(Date.now()).toUTCString(),
			isPu: false,
		};

		if (!compareCookiesList.has(data)) {
			addItemOperation(dispatch)(data);
			console.log('compare ======> ', data);
		}
	};

	useEffect(() => {
		setCompareCookiesList(new Set(compareCookies.items));
	}, [compareCookies.items]);

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

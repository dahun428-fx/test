import { SearchSimilarProductButton as Presenter } from './SearchSimilarProductButton';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	selectCategoryCodeList,
	selectCompleteFlag,
	selectCurrentPartNumberList,
	selectSearchSimilarSpecList,
	selectSeries,
} from '@/store/modules/pages/productDetail';

export const SearchSimilarProductButton: React.VFC = () => {
	const completeFlag = useSelector(selectCompleteFlag);
	const specList = useSelector(selectSearchSimilarSpecList);
	const categoryCodeList = useSelector(selectCategoryCodeList);
	const { categoryName, brandCode, seriesCode, misumiFlag, similarSearchFlag } =
		useSelector(selectSeries);
	const { innerCode, partNumber } =
		useSelector(selectCurrentPartNumberList)[0] ?? {};

	// If no part number specs, not show button.
	if (Flag.isFalse(similarSearchFlag) || !partNumber) {
		return null;
	}

	return (
		<Presenter
			categoryName={categoryName}
			categoryCodeList={categoryCodeList}
			specList={specList}
			partNumber={partNumber}
			seriesCode={seriesCode}
			brandCode={brandCode}
			innerCode={innerCode}
			misumiFlag={misumiFlag}
			disabled={Flag.isFalse(completeFlag) || !specList.length}
		/>
	);
};
SearchSimilarProductButton.displayName = 'SearchSimilarProductButton';

import { useSelector } from 'react-redux';
import {
	selectCategoryCodeList,
	selectSeries,
	selectStandardSpecList,
} from '@/store/modules/pages/productDetail';

/**
 * Standard specifications hook
 */
export const useStandardSpecList = () => {
	const series = useSelector(selectSeries);
	const standardSpecList = useSelector(selectStandardSpecList);
	const categoryCodeList = useSelector(selectCategoryCodeList);

	return { series, standardSpecList, categoryCodeList };
};

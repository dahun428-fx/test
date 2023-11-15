import { useSelector } from 'react-redux';
import {
	selectCategoryCodeList,
	selectStandardSpecList,
} from '@/store/modules/pages/productDetail';

/**
 * Standard specifications hook
 */
export const useStandardSpecList = () => {
	const standardSpecList = useSelector(selectStandardSpecList);
	const categoryCodeList = useSelector(selectCategoryCodeList);

	return { standardSpecList, categoryCodeList };
};

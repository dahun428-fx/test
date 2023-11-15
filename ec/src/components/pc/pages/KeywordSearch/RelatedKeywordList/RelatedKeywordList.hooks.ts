import { useSelector } from '@/store/hooks';
import { selectKeywordResponse } from '@/store/modules/pages/keywordSearch';

/**
 * Related Keyword
 */
export const useRelatedKeyword = () => {
	return useSelector(selectKeywordResponse);
};

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { SharedQuery } from './index.types';
import { KeywordSearch } from '@/components/pc/pages/KeywordSearch';
import { assertNotEmpty } from '@/utils/assertions';
import { getOneParams } from '@/utils/query';
import { toNumeric } from '@/utils/string';

export type Query = SharedQuery;

/**
 * keyword search result
 */
const KeywordSearchPage: NextPage = () => {
	const router = useRouter();
	const {
		Keyword: keyword,
		categoryPage,
		seriesPage,
	} = getOneParams(router.query, ...['Keyword', 'categoryPage', 'seriesPage']);

	// NOTE: KeywordSearchPage page is rendered client side, need to check router is ready
	// Avoid app crash when visit Keyword search page
	if (!router.isReady) {
		return null;
	}

	assertNotEmpty(keyword);

	return (
		<KeywordSearch
			keyword={keyword}
			categoryPage={toNumeric(categoryPage)}
			seriesPage={toNumeric(seriesPage)}
		/>
	);
};
KeywordSearchPage.displayName = 'KeywordSearchPage';
export default KeywordSearchPage;

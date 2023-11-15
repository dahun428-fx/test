import { useRouter } from 'next/router';
import type { SharedQuery } from './index.types';
import { KeywordSearch } from '@/components/mobile/pages/KeywordSearch';
import { Standard } from '@/layouts/mobile/standard';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotEmpty, assertPositiveNumeric } from '@/utils/assertions';
import { getOneParams } from '@/utils/query';
import { toNumeric } from '@/utils/string';

export type Query = SharedQuery;

/**
 * keyword search result.
 */
const KeywordSearchPage: NextPageWithLayout = () => {
	const router = useRouter();

	if (!router.isReady) {
		return null;
	}

	const {
		Keyword: keyword,
		categoryPage,
		seriesPage,
	} = getOneParams(router.query, ...['Keyword', 'seriesPage', 'categoryPage']);

	assertNotEmpty(keyword);
	assertPositiveNumeric(categoryPage);
	assertPositiveNumeric(seriesPage);

	return (
		<KeywordSearch
			keyword={keyword}
			categoryPage={toNumeric(categoryPage)}
			seriesPage={toNumeric(seriesPage)}
		/>
	);
};
KeywordSearchPage.displayName = 'KeywordSearchPage';
KeywordSearchPage.getLayout = Standard;
export default KeywordSearchPage;

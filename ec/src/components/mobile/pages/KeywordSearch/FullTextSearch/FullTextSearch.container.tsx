import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { FullTextSearch as Presenter, PAGE_SIZES } from './FullTextSearch';
import { ectLogger } from '@/logs/ectLogger';
import { SearchFullTextRequest } from '@/models/api/msm/ect/fullText/SearchFullTextRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	searchFullText,
	selectFullTextResponse,
} from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
};

const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];

/**
 * Full text search container
 */
export const FullTextSearch: React.VFC<Props> = ({ keyword }) => {
	const fullTextResponse = useSelector(selectFullTextResponse);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

	const store = useStore();
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const load = useCallback(
		async (conditions: Partial<SearchFullTextRequest> = {}) => {
			await searchFullText(store)({
				keyword,
				pageSize,
				...conditions,
			});

			setCurrentPage(conditions.page ?? 1);

			if (conditions.pageSize) {
				setPageSize(conditions.pageSize);
			}
		},
		[keyword, pageSize, store]
	);

	const handleClick = useCallback(
		(index: number) => {
			if (!fullTextResponse) {
				return;
			}
			ectLogger.searchResult.clickFullTextSearchLink({
				keyword,
				forwardPageUrl: url.searchFullText(
					keyword,
					fullTextResponse.resultList[index]?.url ?? ''
				),
				forwardPageUrlDispNo: String(index + 1),
				isReSearch,
			});
		},
		[fullTextResponse, isReSearch, keyword]
	);

	if (!fullTextResponse || fullTextResponse.resultList.length === 0) {
		return null;
	}

	return (
		<Presenter
			keyword={keyword}
			page={currentPage}
			pageSize={pageSize}
			fullTextResponse={fullTextResponse}
			reload={load}
			onClick={handleClick}
		/>
	);
};
FullTextSearch.displayName = 'FullTextSearch';

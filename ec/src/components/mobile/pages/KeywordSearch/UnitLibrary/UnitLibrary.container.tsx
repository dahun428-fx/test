import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { UnitLibrary as Presenter } from './UnitLibrary';
import { ectLogger } from '@/logs/ectLogger';
import { useSelector } from '@/store/hooks';
import { selectIdeaNoteResponse } from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
};

/** Unit library container */
export const UnitLibrary: React.VFC<Props> = ({ keyword }) => {
	const ideaNoteResponse = useSelector(selectIdeaNoteResponse);

	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const handleClickInCadLink = useCallback(
		(index: number, link: string) => {
			ectLogger.searchResult.clickInCadLink({
				isReSearch,
				keyword: keyword,
				forwardPageUrl: url.searchInCadLibrary(keyword, link),
				forwardPageUrlDispNo: String(index + 1),
			});
		},
		[isReSearch, keyword]
	);

	const handleClickSearchAllLink = useCallback(() => {
		ectLogger.searchResult.clickInCadLinkAll({
			isReSearch,
			keyword: keyword,
			forwardPageUrl: url.searchInCadLibraryAll(keyword),
		});
	}, [isReSearch, keyword]);

	if (!ideaNoteResponse?.searchBeanList.length) {
		return null;
	}

	return (
		<Presenter
			keyword={keyword}
			searchBeanList={ideaNoteResponse.searchBeanList}
			onClickInCadLink={handleClickInCadLink}
			onClickSearchAllLink={handleClickSearchAllLink}
		/>
	);
};
UnitLibrary.displayName = 'UnitLibrary';

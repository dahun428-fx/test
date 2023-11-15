import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { UnitLibrary as Presenter } from './UnitLibrary';
import { ectLogger } from '@/logs/ectLogger';
import { useSelector } from '@/store/hooks';
import {
	selectIdeaNoteResponse,
	selectShouldCollapse,
} from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	keyword: string;
};

export const UnitLibrary: React.VFC<Props> = props => {
	const ideaNoteResponse = useSelector(selectIdeaNoteResponse);
	const shouldCollapse = useSelector(selectShouldCollapse);
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const handleClickInCadLink = useCallback(
		(index: number, link: string) => {
			ectLogger.searchResult.clickInCadLink({
				isReSearch,
				keyword: props.keyword,
				forwardPageUrl: url.searchInCadLibrary(props.keyword, link),
				forwardPageUrlDispNo: String(index + 1),
			});
		},
		[isReSearch, props.keyword]
	);

	const handleClickSearchAllLink = useCallback(() => {
		ectLogger.searchResult.clickInCadLinkAll({
			isReSearch,
			keyword: props.keyword,
			forwardPageUrl: url.searchInCadLibraryAll(props.keyword),
		});
	}, [isReSearch, props.keyword]);

	if (!ideaNoteResponse?.searchBeanList.length) {
		return null;
	}

	return (
		<Presenter
			{...props}
			ideaNoteResponse={ideaNoteResponse}
			defaultExpanded={!shouldCollapse}
			onClickInCadLink={handleClickInCadLink}
			onClickSearchAllLink={handleClickSearchAllLink}
		/>
	);
};

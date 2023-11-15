import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { TechnicalInformation as Presenter } from './TechnicalInformation';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	selectShouldCollapse,
	selectTechFullTextResponse,
} from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
	className?: string;
};

export const TechnicalInformation: React.VFC<Props> = ({
	keyword,
	className,
}) => {
	const technicalInformation = useSelector(selectTechFullTextResponse);
	const shouldCollapse = useSelector(selectShouldCollapse);

	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const handleClick = useCallback(
		(index: number) => {
			ectLogger.searchResult.clickTechnicalInformation({
				keyword,
				isReSearch,
				forwardPageUrl: url
					.searchResult(keyword)
					.withIsReSearch(
						Boolean(
							isReSearch && Flag.isFlag(isReSearch) && Flag.isTrue(isReSearch)
						)
					),
				forwardPageUrlDispNo: String(index + 1),
			});
		},
		[isReSearch, keyword]
	);

	const handleClickShowAll = useCallback(
		(url: string) => {
			ectLogger.searchResult.clickShowAllTechnicalInformation({
				keyword,
				isReSearch,
				forwardPageUrl: url,
			});
		},
		[isReSearch, keyword]
	);

	// Do not display if no technical information available.
	if (!technicalInformation || technicalInformation.totalCount <= 0) {
		return null;
	}

	// Display only 3 items
	const technicalInformationList = technicalInformation.resultList.slice(0, 3);

	return (
		<Presenter
			keyword={keyword}
			technicalInformationList={technicalInformationList}
			defaultExpanded={!shouldCollapse}
			className={className}
			onClick={handleClick}
			onClickShowAll={handleClickShowAll}
		/>
	);
};
TechnicalInformation.displayName = 'TechnicalInformation';

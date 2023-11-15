import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { TechnicalInformation as Presenter } from './TechnicalInformation';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import { selectTechFullTextResponse } from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
};

/**
 * Technical Information container
 */
export const TechnicalInformation: React.VFC<Props> = ({ keyword }) => {
	const technicalInformation = useSelector(selectTechFullTextResponse);

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

	if (!technicalInformation?.totalCount) {
		return null;
	}

	// Display only 3 items
	const technicalInformationList = technicalInformation.resultList.slice(0, 3);

	return (
		<Presenter
			keyword={keyword}
			technicalInformationList={technicalInformationList}
			onClick={handleClick}
			onClickShowAll={handleClickShowAll}
		/>
	);
};
TechnicalInformation.displayName = 'TechnicalInformation';

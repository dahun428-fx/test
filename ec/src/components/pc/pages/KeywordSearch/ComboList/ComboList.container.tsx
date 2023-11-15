import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { ComboList as Presenter } from './ComboList';
import { ectLogger } from '@/logs/ectLogger';
import { Series } from '@/models/api/msm/ect/combo/SearchComboResponse';
import { useSelector } from '@/store/hooks';
import { selectComboResponse } from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	keyword: string;
};

/**
 * Combo list container
 * WARN: Experimental. Violates development rules. Container implementation is forbidden, implement with hooks.
 */
export const ComboList: React.VFC<Props> = ({ className, keyword }) => {
	const comboResponse = useSelector(selectComboResponse);
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const handleClickLink = useCallback(
		(index: number, series: Series, partNumber: string) => {
			ectLogger.searchResult.clickComboLink({
				seriesCode: series.seriesCode,
				brandCode: series.brandCode,
				forwardPageUrlDispNo: String(index + 1),
				forwardPageUrl: url
					.productDetail(series.seriesCode)
					.fromKeywordSearch(keyword)
					.comboLink(partNumber),
				isReSearch,
				keyword: keyword,
			});
		},
		[isReSearch, keyword]
	);

	if (!comboResponse?.totalCount) {
		return null;
	}

	return (
		<Presenter
			className={className}
			keyword={keyword}
			comboResponse={comboResponse}
			onClickLink={handleClickLink}
		/>
	);
};
ComboList.displayName = 'ComboList';

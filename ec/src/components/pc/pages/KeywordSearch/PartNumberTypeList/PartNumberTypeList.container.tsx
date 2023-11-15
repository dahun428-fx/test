import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PartNumberTypeList as Presenter } from './PartNumberTypeList';
import { ectLogger } from '@/logs/ectLogger';
import { useSelector, useStore } from '@/store/hooks';
import {
	loadMoreTypeSpecs,
	selectHasSeries,
	selectPartNumberTypes,
	selectPartNumberTypeSpecs,
} from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	keyword: string;
};

export const PartNumberTypeList: React.VFC<Props> = ({
	className,
	keyword,
}) => {
	const store = useStore();

	const [expanded, setExpanded] = useState<boolean>(false);
	const types = useSelector(selectPartNumberTypes());
	const [showsBottom] = useState(
		selectHasSeries(store.getState()) && types.totalCount > 2
	);
	const displayCount = showsBottom && !expanded ? 2 : undefined;
	const partNumberTypeSpecs = useSelector(
		selectPartNumberTypeSpecs(displayCount)
	);
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const typeList = useMemo(
		() => types.typeList.slice(0, displayCount),
		[displayCount, types.typeList]
	);

	const handleRowClick = useCallback(
		(rowIndex: number) => {
			const type = typeList[rowIndex];
			if (!type) {
				return;
			}
			ectLogger.searchResult.clickPartNumberType({
				keyword,
				isReSearch,
				seriesCode: type.seriesCode,
				brandCode: type.brandCode,
				forwardPageUrlDispNo: String(rowIndex + 1),
				forwardPageUrl: url
					.productDetail(type.seriesCode)
					.fromKeywordSearch(keyword)
					.typeList(type.partNumber, undefined, false),
			});
		},
		[isReSearch, keyword, typeList]
	);

	useEffect(() => {
		if (expanded) {
			loadMoreTypeSpecs(store)();
		}
	}, [expanded, store]);

	if (types.totalCount === 0) {
		return null;
	}

	return (
		<Presenter
			className={className}
			onClick={handleRowClick}
			totalCount={types.totalCount}
			typeList={typeList}
			currencyCode={types.currencyCode}
			showsBottom={showsBottom}
			expanded={expanded}
			setExpanded={setExpanded}
			partNumberTypeSpecs={partNumberTypeSpecs}
		/>
	);
};
PartNumberTypeList.displayName = 'PartNumberTypeList';

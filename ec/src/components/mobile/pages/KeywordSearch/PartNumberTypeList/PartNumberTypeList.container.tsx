import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { PartNumberTypeList as Presenter } from './PartNumberTypeList';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ectLogger } from '@/logs/ectLogger';
import { useSelector } from '@/store/hooks';
import { selectPartNumberTypes } from '@/store/modules/pages/keywordSearch';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

type Props = {
	keyword: string;
	displayType: DisplayTypeOption;
};

/** Part number type list container */
export const PartNumberTypeList: React.VFC<Props> = ({
	keyword,
	displayType,
}) => {
	const { typeList, currencyCode } = useSelector(selectPartNumberTypes());
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const handleClickAlternativeLink = useCallback(
		(href: string, index: number) => {
			if (!keyword) {
				return;
			}

			ectLogger.searchResult.clickAlternativeLink({
				keyword,
				isReSearch,
				forwardPageUrl: href,
				forwardPageUrlDispNo: String(index + 1),
			});
		},
		[isReSearch, keyword]
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

			ga.ecommerce.selectItem({
				seriesCode: type.seriesCode,
				itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
			});
		},
		[isReSearch, keyword, typeList]
	);

	if (!typeList.length) {
		return null;
	}

	return (
		<Presenter
			keyword={keyword}
			typeList={typeList}
			currencyCode={currencyCode}
			displayType={displayType}
			onClick={handleRowClick}
			onClickAlternativeLink={handleClickAlternativeLink}
		/>
	);
};

PartNumberTypeList.displayName = 'PartNumberTypeList';

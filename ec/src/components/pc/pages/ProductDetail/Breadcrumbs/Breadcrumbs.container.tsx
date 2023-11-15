import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { Breadcrumbs as Presenter } from '@/components/pc/ui/links/Breadcrumbs';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { tabIds as ComplexTabIds } from '@/models/domain/series/complexTab';
import type { TabId } from '@/models/domain/series/tab';
import { tabIds as SimpleTabIds } from '@/models/domain/series/tab';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { pagesPath } from '@/utils/$path';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { url } from '@/utils/url';

export const Breadcrumbs: React.VFC = () => {
	const series = useSelector(selectSeries);
	const { query } = useRouter();
	const { translateTab } = useTabTranslation();

	const breadcrumbList = useMemo(() => {
		const {
			categoryCode,
			categoryName,
			categoryList: rawCategoryList,
			seriesName,
		} = series;
		const categoryList: { categoryCode: string; categoryName: string }[] = [
			...rawCategoryList,
		];

		if (categoryCode && categoryName) {
			categoryList.push({ categoryCode, categoryName });
		}

		const breadcrumbs = categoryList.map((category, index, categoryList) => ({
			text: category.categoryName,
			href: url.category(
				...categoryList
					.slice(0, index + 1)
					.map(category => category.categoryCode)
			)(),
		}));

		const {
			Tab: tab,
			HissuCode: hissuCode,
			Page: page,
			CategorySpec: categorySpec,
			PNSearch: pnSearch,
		} = getOneParams(
			query,
			...['Tab', 'HissuCode', 'Page', 'CategorySpec', 'PNSearch']
		);

		// Condition Tab name
		const tabIds: string[] = [...SimpleTabIds, ...ComplexTabIds];
		if (tab && tabIds.includes(tab)) {
			const tabCodeName = translateTab(tab as TabId);
			if (tab == 'codeList') {
				return [...breadcrumbs, { text: seriesName + ' ' + tabCodeName }];
			} else if (tabCodeName) {
				return [
					...breadcrumbs,
					{
						text: seriesName,
						href: pagesPath.vona2.detail._seriesCode(series.seriesCode).$url(),
					},
					{ text: tabCodeName },
				];
			}
		}

		// check condition HissuCode
		if (hissuCode && !tab && !page && !categorySpec && !pnSearch) {
			return [
				...breadcrumbs,
				// to Series view
				{
					text: seriesName,
					href: pagesPath.vona2.detail._seriesCode(series.seriesCode).$url(),
				},
				{
					text: seriesName + ' ' + translateTab('codeList'),
					href: pagesPath.vona2.detail
						._seriesCode(series.seriesCode)
						.$url({ query: { Tab: 'codeList' } }),
				},
				// Part number view
				{ text: removeTags(hissuCode) },
			];
		}

		return [...breadcrumbs, { text: seriesName }];
	}, [query, series, translateTab]);

	return <Presenter displayMode="html" breadcrumbList={breadcrumbList} />;
};
Breadcrumbs.displayName = 'Breadcrumbs';

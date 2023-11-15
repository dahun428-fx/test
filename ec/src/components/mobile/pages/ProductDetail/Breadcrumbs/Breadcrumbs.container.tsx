import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { BreadcrumbsPortal } from '@/components/mobile/layouts/footers/Footer/BreadcrumbsPortal';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { tabIds as ComplexTabIds } from '@/models/domain/series/complexTab';
import type { TabId } from '@/models/domain/series/tab';
import { tabIds as SimpleTabIds } from '@/models/domain/series/tab';
import { useSelector } from '@/store/hooks';
import {
	selectSeries,
	selectTemplateType,
} from '@/store/modules/pages/productDetail';
import { pagesPath } from '@/utils/$path';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { url } from '@/utils/url';

export const Breadcrumbs: React.VFC = () => {
	const series = useSelector(selectSeries);
	const { query } = useRouter();
	const { translateTab } = useTabTranslation();
	const templateType = useSelector(selectTemplateType);

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
		// NOTE: Do not display the breadcrumb link for product details with a part number if the template is simple or
		// WYSIWYG and the HissuCode parameter exists, but do display it if the template is complex.
		if (
			hissuCode &&
			!tab &&
			!page &&
			!categorySpec &&
			!pnSearch &&
			templateType !== TemplateType.SIMPLE
		) {
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
	}, [query, series, templateType, translateTab]);

	return <BreadcrumbsPortal breadcrumbList={breadcrumbList} dangerouslyHtml />;
};
Breadcrumbs.displayName = 'Breadcrumbs';

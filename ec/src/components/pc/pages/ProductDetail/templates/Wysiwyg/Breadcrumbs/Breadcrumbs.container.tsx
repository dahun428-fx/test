import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { Breadcrumbs as Presenter } from '@/components/pc/ui/links/Breadcrumbs';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { tabIds as complexTabIds } from '@/models/domain/series/complexTab';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { pagesPath } from '@/utils/$path';
import { getOneParams } from '@/utils/query';
import { url } from '@/utils/url';

export const Breadcrumbs: React.VFC = () => {
	const series = useSelector(selectSeries);
	const { query } = useRouter();
	const { translateTabQuery } = useTabTranslation();

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

		const { Tab: tab } = getOneParams(query, ...['Tab']);

		// Condition Tab name
		const tabIds: string[] = [...complexTabIds];
		if (tab && tabIds.includes(tab)) {
			const tabCodeName = translateTabQuery(tab);
			if (tabCodeName) {
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

		return [...breadcrumbs, { text: seriesName }];
	}, [query, series, translateTabQuery]);

	return <Presenter displayMode="html" breadcrumbList={breadcrumbList} />;
};
Breadcrumbs.displayName = 'Breadcrumbs';

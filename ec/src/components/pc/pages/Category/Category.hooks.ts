import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getLeftBannerCategory } from '@/api/services/legacy/htmlContents/category/getLeftBannerCategory';
import { Breadcrumb } from '@/components/pc/ui/links/Breadcrumbs';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { loadOperation } from '@/store/modules/pages/category/operations';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';
import {
	getBreadcrumbListWithSpecSearchForCategory,
	getCategoryListFromRoot,
	getCategorySpecFromQuery,
} from '@/utils/domain/category';
import { url } from '@/utils/url';

type CategoryPageParams = {
	categoryCode: string;
	topCategoryCode: string;
	categoryResponse: SearchCategoryResponse;
	seriesResponse?: SearchSeriesResponse$search;
	brandResponse?: SearchBrandResponse;
	page: number;
	categorySpec?: string;
};

/** Category hook */
export const useCategory = ({
	categoryCode,
	topCategoryCode,
	categoryResponse,
	brandResponse,
	seriesResponse,
	page,
	categorySpec,
}: CategoryPageParams) => {
	const dispatch = useDispatch();
	const [t] = useTranslation();
	const [leftBannerResponse, setLeftBannerResponse] = useState<string>();
	const categoryList = useMemo(() => {
		if (!categoryResponse?.categoryList[0]) {
			return [];
		}

		return getCategoryListFromRoot(
			categoryResponse.categoryList[0],
			categoryCode
		);
	}, [categoryCode, categoryResponse]);

	const category = last(categoryList);

	const categorySpecForBreadcrumbs = useMemo(() => {
		if (!seriesResponse || !categorySpec) {
			return null;
		}

		return getCategorySpecFromQuery(categorySpec, seriesResponse);
	}, [categorySpec, seriesResponse]);

	const breadcrumbs: Breadcrumb[] = useMemo(() => {
		if (!categoryResponse) {
			return [];
		}
		const rootCategory = categoryResponse.categoryList[0];
		assertNotNull(rootCategory);

		const breadcrumbList: Breadcrumb[] = [];

		const categoryList = getCategoryListFromRoot(rootCategory, categoryCode);
		const currentCategory = categoryList.pop();

		categoryList.forEach((category, index) => {
			breadcrumbList.push({
				text: category.categoryName,
				href: url.category(
					...categoryList
						.slice(0, index)
						.map(({ categoryCode }) => categoryCode),
					category.categoryCode
				)(),
			});
		});

		const breadcrumbListWithSpecSearch =
			getBreadcrumbListWithSpecSearchForCategory({
				categoryList,
				currentCategory,
				page,
				categorySpec: categorySpecForBreadcrumbs,
				t,
			});

		breadcrumbList.push(...breadcrumbListWithSpecSearch);

		return breadcrumbList;
	}, [categoryCode, categoryResponse, categorySpecForBreadcrumbs, page, t]);

	const loadLeftBanner = useCallback(async () => {
		try {
			const response = await getLeftBannerCategory(topCategoryCode);
			setLeftBannerResponse(response);
		} catch {
			// noop
		}
	}, [topCategoryCode]);

	useOnMounted(() => {
		loadOperation(dispatch)({
			brandIndexList: brandResponse?.brandList,
			categoryResponse,
			seriesResponse,
		});
		loadLeftBanner();
	});

	return {
		breadcrumbs,
		category,
		categoryList,
		leftBannerResponse,
	};
};

import { useCallback, useEffect, useState } from 'react';
import { Sitemap as Presenter } from './Sitemap';
import { searchBrand as searchBrandApi } from '@/api/services/searchBrand';
import { searchCategory as searchCategoryApi } from '@/api/services/searchCategory';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getBrandGroupList } from '@/utils/domain/brand';

/**
 * Sitemap container component
 */
export const Sitemap: React.VFC = () => {
	const [searchCategoryResponse, setSearchCategoryResponse] =
		useState<SearchCategoryResponse>();
	const [searchBrandResponse, setSearchBrandResponse] =
		useState<SearchBrandResponse>();

	const searchCategory = useCallback(async () => {
		try {
			// NOTE: Show all levels of category to sitemap to improve SEO.
			const response = await searchCategoryApi({
				categoryLevel: 0,
				page: 1,
				pageSize: 1,
			});
			setSearchCategoryResponse(response);
		} catch (error) {
			// Suppress any display on the screen even if this API encounters an error.
			setSearchCategoryResponse(undefined);
		}
	}, []);

	const searchBrand = useCallback(async () => {
		try {
			const response = await searchBrandApi({
				sort: '1',
				page: 1,
				pageSize: 0,
			});
			setSearchBrandResponse(response);
		} catch (error) {
			// Suppress any display on the screen even if this API encounters an error.
			setSearchBrandResponse(undefined);
		}
	}, []);

	useEffect(() => {
		searchCategory();
		searchBrand();
	}, [searchBrand, searchCategory]);

	useOnMounted(() => {
		ectLogger.visit();
		aa.pageView.unclassified();
		ga.pageView.unclassified();
	});

	const categoryList = searchCategoryResponse?.categoryList ?? [];
	const brandList = searchBrandResponse?.brandList ?? [];
	const brandGroupList = getBrandGroupList({
		brandList,
		brandCodeList: brandList.map(brand => brand.brandCode),
	});

	return (
		<Presenter categoryList={categoryList} brandGroupList={brandGroupList} />
	);
};
Sitemap.displayName = 'Sitemap';

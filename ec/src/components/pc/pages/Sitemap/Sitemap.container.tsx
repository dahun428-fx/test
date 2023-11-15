import { useCallback, useEffect, useState } from 'react';
import { Sitemap as Presenter } from './Sitemap';
import { searchBrand as searchBrandApi } from '@/api/services/searchBrand';
import { searchCategory as searchCategoryApi } from '@/api/services/searchCategory';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getBrandGroupList } from '@/utils/domain/brand';

export const Sitemap: React.VFC = () => {
	const [searchCategoryResponse, setSearchCategoryResponse] =
		useState<SearchCategoryResponse>();
	const [searchBrandResponse, setSearchBrandResponse] =
		useState<SearchBrandResponse>();

	const searchCategory = useCallback(async () => {
		try {
			const response = await searchCategoryApi({
				categoryLevel: 5,
				page: 1,
				pageSize: 1,
			});
			setSearchCategoryResponse(response);
		} catch (error) {
			// このAPIがエラーになっても画面に何も表示しないので握りつぶし
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
			// このAPIがエラーになっても画面に何も表示しないので握りつぶし
			setSearchBrandResponse(undefined);
		}
	}, []);

	useEffect(() => {
		searchCategory();
		searchBrand();
	}, [searchBrand, searchCategory]);

	useEffect(() => {
		ectLogger.visit();
		aa.pageView.unclassified();
		ga.pageView.unclassified();
	}, []);

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

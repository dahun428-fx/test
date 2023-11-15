import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	Brand,
	SearchBrandResponse,
} from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { loadOperation } from '@/store/modules/pages/category/operations';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';
import { getCategoryListFromRoot } from '@/utils/domain/category';

type MakerCategoryPageParams = {
	brandResponse: SearchBrandResponse;
	seriesResponse?: SearchSeriesResponse$search;
	categoryResponse: SearchCategoryResponse;
	brandIndexList: Brand[];
	categoryCode: string;
};

/** Maker category container hook */
export const useMakerCategoryContainer = ({
	brandResponse,
	seriesResponse,
	categoryResponse,
	brandIndexList,
	categoryCode,
}: MakerCategoryPageParams) => {
	const dispatch = useDispatch();

	const categoryList = useMemo(() => {
		assertNotNull(categoryResponse.categoryList[0]);
		return getCategoryListFromRoot(
			categoryResponse.categoryList[0],
			categoryCode
		);
	}, [categoryCode, categoryResponse]);

	const category = last(categoryList);
	assertNotNull(category);

	useOnMounted(() => {
		loadOperation(dispatch)({
			brandIndexList,
			brandResponse,
			categoryResponse,
			seriesResponse,
		});
	});

	return {
		category,
		categoryList,
	};
};

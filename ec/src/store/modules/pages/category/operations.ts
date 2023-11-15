import { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import { selectPreviousSearchSeriesCondition } from './selectors';
import { actions } from './slice';
import { CategoryState, SeriesAndBrandResponse } from './type';
import { searchBrand } from '@/api/services/searchBrand';
import { searchSeries$search } from '@/api/services/searchSeries';
import { Flag } from '@/models/api/Flag';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { AppStore } from '@/store';
import { first, last } from '@/utils/collection';
import { getCategoryListFromRoot } from '@/utils/domain/category';
import { notEmpty, notNull } from '@/utils/predicate';

const BRAND_FOR_INDEX_MAX_COUNT = 500;

export function loadOperation(dispatch: Dispatch) {
	return (params: CategoryState) => {
		dispatch(actions.load(params));
	};
}

export function searchSeries(store: AppStore) {
	return async (condition: SearchSeriesRequest, cancelToken?: CancelToken) => {
		const prevCondition = selectPreviousSearchSeriesCondition(store.getState());

		const mergedCondition = { ...prevCondition, ...condition };

		const seriesResponse = await searchSeries$search(
			mergedCondition,
			cancelToken
		);
		store.dispatch(actions.load({ seriesResponse }));
	};
}

export function clearAllSelectedFilter(store: AppStore) {
	return async (
		condition: Pick<SearchSeriesRequest, 'categoryCode' | 'pageSize' | 'page'>,
		cancelToken?: CancelToken
	) => {
		const seriesResponse = await searchSeries$search(condition, cancelToken);

		store.dispatch(actions.load({ seriesResponse }));
	};
}

export async function getSeriesAndBrandResponse({
	categoryCode,
	categoryResponse,
	params,
}: {
	categoryCode: string | string[] | undefined;
	categoryResponse: SearchCategoryResponse;
	params?: SearchSeriesRequest;
}): Promise<SeriesAndBrandResponse> {
	let seriesResponse: SearchSeriesResponse$search | undefined;
	let brandResponse: SearchBrandResponse | undefined;

	const firstCategory = first(categoryResponse.categoryList);
	if (
		typeof categoryCode === 'string' &&
		notEmpty(categoryResponse.categoryList) &&
		notNull(firstCategory)
	) {
		const lastCategory = last(
			getCategoryListFromRoot(firstCategory, categoryCode)
		);

		if (Flag.isTrue(lastCategory?.specSearchFlag)) {
			seriesResponse = await searchSeries$search({
				categoryCode,
				...params,
			});

			if (seriesResponse) {
				const { brandList } = seriesResponse;
				if (
					notEmpty(brandList) &&
					brandList.length <= BRAND_FOR_INDEX_MAX_COUNT
				) {
					await searchBrand({
						brandCode: brandList.map(({ brandCode }) => brandCode),
					})
						.then(searchBrandResponse => {
							brandResponse = searchBrandResponse;
						})
						.catch(() => {
							/// noop
						});
				}
			}
		}
	}

	return { seriesResponse, brandResponse };
}

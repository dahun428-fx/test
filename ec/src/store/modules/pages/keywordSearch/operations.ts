import { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import { getKeywordBanner } from '@/api/services/getKeywordBanner';
import { searchIdeaNote } from '@/api/services/legacy/cms/searchIdeaNote';
import { searchBrand } from '@/api/services/searchBrand';
import { searchCategory } from '@/api/services/searchCategory';
import { searchCombo } from '@/api/services/searchCombo';
import { searchFullText as searchFullTextFromApi } from '@/api/services/searchFullText';
import { searchKeyword } from '@/api/services/searchKeyword';
import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchSeries$search } from '@/api/services/searchSeries';
import { searchTechFullText } from '@/api/services/searchTechFullText';
import { searchType } from '@/api/services/searchType';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ectLogger } from '@/logs/ectLogger';
import { ShowResultLogPayload } from '@/logs/ectLogger/searchResult';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchFullTextRequest } from '@/models/api/msm/ect/fullText/SearchFullTextRequest';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { AppStore } from '@/store';
import {
	selectPartNumberTypes,
	selectPreviousSearchSeriesCondition,
	selectTypePartNumberResponses,
	selectShowsSpecPanel,
	generateSelectedSpec,
} from '@/store/modules/pages/keywordSearch/selectors';
import { actions } from '@/store/modules/pages/keywordSearch/slice';
import { Status } from '@/store/modules/pages/keywordSearch/types';
import { assertNotNull } from '@/utils/assertions';
import { xor } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';
import { classifySeriesList } from '@/utils/domain/series';
import { fromEntries } from '@/utils/object';
import { notEmpty } from '@/utils/predicate';

const COMBO_COUNT = 5;
const CATEGORY_PAGE_SIZE = 11;
const BRAND_FOR_INDEX_MAX_COUNT = 500;
const SERIES_PAGE_SIZE = 30;

type LoadPayload = {
	keyword?: string;
	categoryPage?: number;
	seriesPage?: number;
	categoryPageSize?: number;
	brandMode?: '0' | '1' | '2';
	isReSearch?: string;
};

type Options = {
	isMobile: boolean;
};

function loadBrand(
	keyword: string,
	isMobile?: boolean
): Promise<SearchBrandResponse> {
	if (!isMobile) {
		return searchBrand({
			keyword,
			sort: '2',
			page: 1,
			pageSize: 10,
		});
	}

	return Promise.resolve({
		totalCount: 0,
		brandList: [],
	});
}

/**
 * Load operation
 * TODO: 各リクエストパラメータ見直し要
 */
export function load(dispatch: Dispatch) {
	return async (payload: LoadPayload, option?: Options) => {
		const {
			keyword,
			categoryPage = 1,
			seriesPage = 1,
			categoryPageSize = CATEGORY_PAGE_SIZE,
			brandMode,
			isReSearch,
		} = payload;
		assertNotNull(keyword);

		const logPayload: ShowResultLogPayload = {
			keyword,
			brandMode,
			isReSearch,
			searchResultType: 'NotFound',
			responseTime: 0,
			selectedKeywordDispNo: '',
			resultCount: 0,
			brandCount: 0,
			categoryCount: 0,
			seriesCount: 0,
			inCadLibraryCount: 0,
			fullTextSearchCount: 0,
			technicalInfoCount: 0,
			comboCount: 0,
			discontinuedCount: 0,
			innerMatchingCount: 0,
			cNaviCount: 0,
		};

		dispatch(actions.update({ status: Status.LOADING }));

		const timeStart = Date.now();

		const [
			brandResponse,
			keywordResponse,
			categoryResponse,
			seriesResponse,
			typeResponse,
			keywordBannerResponse,
		] = await Promise.all([
			loadBrand(keyword, option?.isMobile),
			searchKeyword({ keyword, count: 5 }),
			searchCategory({
				keyword,
				page: Number(categoryPage),
				pageSize: categoryPageSize,
			}),
			searchSeries$search({
				keyword,
				sort: '9',
				page: Number(seriesPage),
				pageSize: Number(
					getCookie(Cookie.VONA_ITEM_RESULT_PER_PAGE) || SERIES_PAGE_SIZE
				),
			}),
			searchType({ partNumber: keyword }),
			getKeywordBanner({ keyword }),
		]);

		const shouldCollapse =
			categoryResponse.totalCount === 0 &&
			seriesResponse.totalCount >= 1 &&
			typeResponse.totalCount === 1;

		dispatch(
			actions.update({
				status: Status.LOADED_MAIN,
				brandResponse,
				keywordResponse,
				categoryResponse,
				seriesResponse,
				typeResponse,
				keywordBannerResponse,
				shouldCollapse,
			})
		);

		const textFullPromise = Promise.all([
			searchFullTextFromApi({ keyword }),
			searchTechFullText({ keyword }),
		]).then(([fullTextResponse, techFullTextResponse]) => {
			logPayload.fullTextSearchCount = fullTextResponse.totalCount;
			logPayload.technicalInfoCount = techFullTextResponse.totalCount;

			dispatch(
				actions.update({
					fullTextResponse,
					techFullTextResponse,
				})
			);
		});

		const ideaNotePromise = searchIdeaNote(keyword)
			.then(ideaNoteResponse => {
				logPayload.inCadLibraryCount = ideaNoteResponse.searchCount;
				dispatch(actions.update({ ideaNoteResponse }));
			})
			.catch(noop);

		// for Brand popover
		const { brandList } = seriesResponse;
		if (notEmpty(brandList) && brandList.length <= BRAND_FOR_INDEX_MAX_COUNT) {
			searchBrand({
				brandCode: brandList.map(({ brandCode }) => brandCode),
			})
				.then(({ brandList }) =>
					dispatch(actions.update({ brandIndexList: brandList }))
				)
				.catch(noop);
		}

		// Should load combo, if the category or series or type exists.
		let comboPromise;
		if (
			categoryResponse.totalCount === 0 &&
			seriesResponse.totalCount === 0 &&
			typeResponse.totalCount === 0
		) {
			comboPromise = searchCombo({
				partNumber: keyword,
				count: COMBO_COUNT,
			})
				.then(comboResponse => {
					logPayload.comboCount = comboResponse.totalCount;
					dispatch(actions.update({ comboResponse }));
					ga.ecommerce.viewItemList(
						comboResponse.seriesList.map(item => ({
							seriesCode: item.seriesCode,
							itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
						}))
					);
					aa.events.sendViewCombo();
				})
				.catch(() => {
					// NOTE: Dispatch combo response when API or network error to able
					// handle showing main content (No Result or having category list, series list.
					const comboResponse = {
						totalCount: 0,
						seriesList: [],
					};
					dispatch(
						actions.update({
							comboResponse,
						})
					);
				});
		}

		// If hit types exists, load its specs.
		if (typeResponse.totalCount > 0) {
			const displayCount = seriesResponse.totalCount > 0 ? 2 : 10;
			const targetSeriesList = typeResponse.seriesList
				.filter(
					series =>
						series.seriesStatus !== SeriesStatus.UNLISTED && series.seriesCode
				)
				.slice(0, displayCount);

			Promise.all(
				targetSeriesList.map(series =>
					searchPartNumber$search({
						seriesCode: series.seriesCode,
						partNumber: series.partNumber,
					})
				)
			)
				.then(responseList => {
					const partNumberResponses = fromEntries(
						targetSeriesList.map((series, index) => [
							`${series.seriesCode}\t${series.partNumber}`,
							responseList[index],
						])
					);
					dispatch(actions.update({ partNumberResponses }));
				})
				.catch(noop);
		}

		const timeEnd = Date.now();
		const responseTime = timeEnd - timeStart;
		dispatch(
			actions.update({
				responseTime,
			})
		);

		Promise.all([textFullPromise, ideaNotePromise, comboPromise]).then(() => {
			dispatch(actions.update({ status: Status.READY }));
			ga.events.keywordSearch.hitCount(payload.keyword);
			aa.events.sendResultTotalCounts();

			// NOTE: For other data, using totalCount value from response,
			// Only brandCount is being used with brandList.length
			// Need to verify this, firstly following to the original implementation
			logPayload.brandCount = brandResponse.brandList.length;
			logPayload.categoryCount = categoryResponse.totalCount;
			logPayload.seriesCount = seriesResponse.totalCount;
			logPayload.innerMatchingCount = typeResponse.totalCount;
			const { discontinuedList } = classifySeriesList(typeResponse);
			logPayload.discontinuedCount = discontinuedList.length;

			const searchCount =
				logPayload.brandCount +
				logPayload.categoryCount +
				logPayload.seriesCount +
				logPayload.inCadLibraryCount +
				logPayload.fullTextSearchCount +
				logPayload.discontinuedCount +
				logPayload.technicalInfoCount +
				logPayload.innerMatchingCount;

			const hitCount =
				logPayload.brandCount +
				logPayload.innerMatchingCount +
				(keywordBannerResponse.bannerPath ? 1 : 0) +
				keywordResponse.keywordList.length +
				logPayload.seriesCount +
				logPayload.categoryCount +
				logPayload.fullTextSearchCount +
				logPayload.technicalInfoCount +
				logPayload.inCadLibraryCount;

			logPayload.resultCount = hitCount;
			logPayload.responseTime = responseTime;
			logPayload.searchResultType = searchCount > 0 ? 'Hit' : 'NotFound';

			ectLogger.searchResult.visit(logPayload);
		});

		// NOTE: Unlisted and discontinued products are not counted
		//       because there is no product detail page.
		const normalSeriesList = typeResponse.seriesList.filter(
			series => series.seriesStatus === SeriesStatus.NORMAL
		);

		if (normalSeriesList.length || seriesResponse.seriesList.length) {
			ga.ecommerce.viewItemList([
				...normalSeriesList.map(item => ({
					seriesCode: item.seriesCode,
					itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
				})),
				...seriesResponse.seriesList.map(item => ({
					seriesCode: item.seriesCode,
					itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
				})),
			]);
		}
	};
}

export function loadMoreTypeSpecs(store: AppStore) {
	return async () => {
		const storeState = store.getState();
		const { typeList } = selectPartNumberTypes()(storeState);
		const typeSpecResponses = selectTypePartNumberResponses(storeState) ?? {};

		const normalAndDiscontinuedList = typeList.filter(
			type => type.seriesStatus !== SeriesStatus.UNLISTED
		);

		const targetTypeList = normalAndDiscontinuedList.filter(
			({ seriesCode, partNumber }) =>
				typeSpecResponses[`${seriesCode}\t${partNumber}`] == null
		);

		await Promise.all(
			targetTypeList
				.filter(
					({ seriesCode, partNumber }) =>
						typeSpecResponses[`${seriesCode}\t${partNumber}`] == null
				)
				.map(({ seriesCode, partNumber }) =>
					searchPartNumber$search({ seriesCode, partNumber })
				)
		).then(responses =>
			store.dispatch(
				actions.addTypeSpecs(
					fromEntries(
						targetTypeList.map((type, index) => [
							`${type.seriesCode}\t${type.partNumber}`,
							responses[index],
						])
					)
				)
			)
		);
	};
}

export function searchSeries(store: AppStore) {
	return async (condition: SearchSeriesRequest, cancelToken?: CancelToken) => {
		const prevCondition = selectPreviousSearchSeriesCondition(store.getState());

		const mergedCondition = { ...prevCondition, ...condition };

		let seriesResponse = await searchSeries$search(
			mergedCondition,
			cancelToken
		);
		const newSelectedSpec = generateSelectedSpec(seriesResponse);

		let shouldRetry = false;
		for (const [key, currentValue] of Object.entries(newSelectedSpec)) {
			const requestValue = mergedCondition[key];

			switch (key) {
				case 'cadType':
				case 'brandCode':
				case 'categoryCode': {
					shouldRetry = xor(currentValue, requestValue).length > 0;
					break;
				}
				case 'cValueFlag':
				case 'daysToShip': {
					shouldRetry = currentValue !== requestValue;
					break;
				}
			}

			if (shouldRetry) {
				break;
			}
		}

		if (shouldRetry) {
			seriesResponse = await searchSeries$search(
				{
					...condition,
					...newSelectedSpec,
				},
				cancelToken
			);
		}

		store.dispatch(actions.update({ seriesResponse }));

		ga.ecommerce.viewItemList(
			seriesResponse.seriesList.map(item => ({
				seriesCode: item.seriesCode,
				itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
			}))
		);
	};
}

export function clearSearchSeriesFilter(store: AppStore) {
	return async (keyword?: string, cancelToken?: CancelToken) => {
		if (!keyword) {
			store.dispatch(actions.update({ seriesResponse: undefined }));
			return;
		}
		const seriesResponse = await searchSeries$search(
			{
				keyword,
				sort: '9',
				pageSize: Number(
					getCookie(Cookie.VONA_ITEM_DETAIL_PER_PAGE) || SERIES_PAGE_SIZE
				),
			},
			cancelToken
		);
		store.dispatch(actions.update({ seriesResponse }));

		ga.ecommerce.viewItemList(
			seriesResponse.seriesList.map(item => ({
				seriesCode: item.seriesCode,
				itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
			}))
		);
	};
}

export function fetchCategoryByPage(dispatch: Dispatch) {
	return (keyword: string, page: number) => {
		return searchCategory({ keyword, page, pageSize: CATEGORY_PAGE_SIZE }).then(
			categoryResponse => dispatch(actions.update({ categoryResponse }))
		);
	};
}

/**
 * Clear keyword search module state.
 */
export function clear(dispatch: Dispatch) {
	return () => {
		dispatch(actions.clear());
	};
}

function noop() {
	// noop
}

export function searchFullText(store: AppStore) {
	return async (
		condition: SearchFullTextRequest,
		cancelToken?: CancelToken
	) => {
		const fullTextResponse = await searchFullTextFromApi(
			condition,
			cancelToken
		);
		store.dispatch(actions.update({ fullTextResponse }));
	};
}

/** Toggle showsSpecPanel for mobile */
export function toggleShowsSpecPanel(store: AppStore) {
	return () => {
		const showsSpecPanel = selectShowsSpecPanel(store.getState());
		store.dispatch(actions.update({ showsSpecPanel: !showsSpecPanel }));
	};
}

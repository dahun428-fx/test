import Router from 'next/router';
import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { SeriesList as Presenter } from './SeriesList';
import { searchSeries$search } from '@/api/services/searchSeries';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { SpecSearchDispType } from '@/models/api/constants/SpecSearchDispType';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { SeriesSortType } from '@/models/pages/category';
import { assertNotNull } from '@/utils/assertions';
import { first, xor } from '@/utils/collection';
import { getCategoryParams } from '@/utils/domain/category';
import { getDaysToShipMessageSpecFilter } from '@/utils/domain/daysToShip';
import {
	flatSpecValueList,
	selected,
	stringifySpecValues,
	parseSpecValue,
	toDisplayType,
	getDefaultDisplayType,
	getSeriesListPageSize,
} from '@/utils/domain/spec';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { fromEntries, removeEmptyProperties } from '@/utils/object';
import { getOneParams } from '@/utils/query';

const PAGE_SIZE = 45;

type Props = {
	category: Category;
	topCategoryCode: string;
	categoryList: Category[];
	loadingCategory: boolean;
	rootCategoryList: Category[];
};

export const SeriesList: VFC<Props> = ({
	category,
	topCategoryCode,
	categoryList,
	loadingCategory,
	rootCategoryList,
}) => {
	const [t] = useTranslation();

	const { categoryName, categoryCode } = category;
	const [seriesResponse, setSeriesResponse] = useState<
		SearchSeriesResponse$search | undefined
	>();
	const [page, setPage] = useState<number>();
	const [loading, startToLoad, endLoading] = useBoolState(false);
	const [displayType, setDisplayType] = useState<SpecSearchDispType>();
	const [sortType, setSortType] = useState<SeriesSortType>(
		SeriesSortType.POPULARITY
	);
	const { DispMethod: dispTypeQuery } = getOneParams(
		Router.query,
		'DispMethod'
	);

	// TODO: API を更新する必要があるかは要確認：
	// https://github.com/misumi-org/order-web-my/pull/1169#discussion_r1151364069
	const handleChangeDisplayType = useCallback(() => {
		setDisplayType(prev =>
			prev === SpecSearchDispType.PHOTO
				? SpecSearchDispType.LIST
				: SpecSearchDispType.PHOTO
		);
	}, []);

	// Only for handler functions, do not pass it directly to the component.
	const load = useCallback(
		async (condition: Partial<SearchSeriesRequest> = {}) => {
			try {
				startToLoad();

				const searchSeriesResponse = await searchSeries$search({
					categoryCode,
					page: 1,
					pageSize: PAGE_SIZE,
					...condition,
				});
				setPage(condition.page ?? 1);
				setSeriesResponse(searchSeriesResponse);
				return searchSeriesResponse;
			} finally {
				endLoading();
			}
		},
		[categoryCode, endLoading, startToLoad]
	);

	useOnMounted(() => {
		const { DispMethod } = getOneParams(Router.query, 'DispMethod');
		const departmentCode = category.departmentCode;

		loadOnMounted().then(response => {
			const specSearchDispType = toDisplayType(
				getDefaultDisplayType({
					displayTypeQuery: DispMethod,
					seriesDisplayType: response.specSearchDispType,
				})
			);

			// ect
			ectLogger.visit({
				classCode: ClassCode.CATEGORY,
				specSearchDispType,
			});
			// GA
			ga.pageView.category.lower({
				departmentCode: departmentCode,
				categoryList: rootCategoryList.slice(1).map(rootCategory => ({
					categoryCode: rootCategory.categoryCode,
					categoryName: rootCategory.categoryName,
				})),
				categoryCode: first(rootCategoryList)?.categoryCode,
				layout: specSearchDispType,
				pageSize: getSeriesListPageSize(),
				productClass: 'Product',
			});
		});

		// AA
		aa.pageView.category.spec({
			categoryCodeList: [
				...category.parentCategoryCodeList,
				category.categoryCode,
			],
		});
	});

	const loadOnMounted = useCallback(() => {
		const { categorySpec, ...rest } = getCategoryParams(Router.query);
		return load({
			...parseSpecValue(categorySpec),
			...rest,
			categoryCode,
			pageSize: PAGE_SIZE,
		});
	}, [categoryCode, load]);

	const getPreviousSearchSeriesCondition = useCallback(() => {
		assertNotNull(
			seriesResponse,
			'This function is designed to be triggered only after the page has finished loading, so the seriesResponse should not be null.'
		);

		const { daysToShipList, brandList, cValue, seriesSpecList } =
			seriesResponse;
		const selectedDaysToShip = daysToShipList.find(selected);
		const selectedBrandCode = brandList
			? brandList.filter(selected).map(({ brandCode }) => brandCode)
			: [];

		const selectedSpec = fromEntries(
			seriesSpecList.map(spec => [
				spec.specCode,
				flatSpecValueList(spec.specValueList)
					.filter(selected)
					.map(item => item.specValue),
			])
		);

		return {
			brandCode: selectedBrandCode,
			cValueFlag: cValue.selectedFlag,
			daysToShip: selectedDaysToShip?.daysToShip,
			sort: sortType,
			...removeEmptyProperties(selectedSpec),
		};
	}, [seriesResponse, sortType]);

	const handleClearFilter = useCallback(() => {
		load();
		window.scrollTo({ top: 0 });
	}, [load]);

	const sendLog = useCallback(
		(payload: SendLogPayload) => {
			ectLogger.series.changeSpec({
				categoryCode,
				...payload,
			});
		},
		[categoryCode]
	);

	// キーワード検索画面のロジックに合わせて、ブランド変更ログはこちらで生成します。
	const sendChangeBrandLog = useCallback(
		(selectedBrandCodes: string[], selectedCValueFlag?: Flag) => {
			if (!seriesResponse) {
				return;
			}

			const previousCondition = getPreviousSearchSeriesCondition();

			// 選択された brandList が前回との差分だけログを送信する
			const difference = seriesResponse.brandList.find(
				brand =>
					brand.brandCode ===
					first(xor(previousCondition.brandCode, selectedBrandCodes))
			);

			if (!!difference) {
				sendLog({
					specName: 'Brand',
					specValueDisp: difference.brandName,
					selected:
						selectedBrandCodes.length > previousCondition.brandCode.length,
				});
			}

			if (selectedCValueFlag !== previousCondition.cValueFlag) {
				sendLog({
					specName: 'c_value',
					specValueDisp: 'Economy series',
					selected: Flag.isTrue(selectedCValueFlag),
				});
			}
		},
		[getPreviousSearchSeriesCondition, sendLog, seriesResponse]
	);

	// キーワード検索画面のロジックに合わせて、出荷日変更ログはこちらで生成します。
	const sendChangeDaysToShipLog = useCallback(
		(daysToShip?: number) => {
			const specValueDisp =
				daysToShip === undefined
					? 'All'
					: // If multiple languages exist, different logs will be sent for the same operation on different language pages.
					  // Therefore, it's better not to pass the translation function here.
					  getDaysToShipMessageSpecFilter(daysToShip, t);

			sendLog({
				specName: 'Days to Ship',
				specValueDisp,
				selected: true,
			});
		},
		[sendLog, t]
	);

	const handleChangeSpec = useCallback(
		async (payload: ChangePayload) => {
			const { selectedSpecs, log } = payload;
			load({
				...getPreviousSearchSeriesCondition(),
				...selectedSpecs,
			});

			ga.events.specSearchTimes();

			if (
				'brandCode' in selectedSpecs &&
				selectedSpecs.brandCode instanceof Array
			) {
				const cValueFlag =
					'cValueFlag' in selectedSpecs &&
					typeof selectedSpecs.cValueFlag === 'string' &&
					Flag.isFlag(selectedSpecs.cValueFlag)
						? selectedSpecs.cValueFlag
						: undefined;

				sendChangeBrandLog(selectedSpecs.brandCode, cValueFlag);
			} else if (
				'daysToShip' in selectedSpecs &&
				(typeof selectedSpecs.daysToShip === 'number' ||
					selectedSpecs.daysToShip === undefined)
			) {
				sendChangeDaysToShipLog(selectedSpecs.daysToShip);
			} else if (log) {
				if (log instanceof Array) {
					log.forEach(sendLog);
				} else {
					sendLog(log);
				}
			}
		},
		[
			getPreviousSearchSeriesCondition,
			load,
			sendChangeBrandLog,
			sendChangeDaysToShipLog,
			sendLog,
		]
	);

	const handleChangePage = useCallback(
		(newPage: number) => {
			if (newPage === page) {
				return;
			}

			load({ ...getPreviousSearchSeriesCondition(), page: newPage });
			window.scrollTo({ top: 0 });
		},
		[page, load, getPreviousSearchSeriesCondition]
	);

	const handleChangeSortType = useCallback(
		async (sort: SeriesSortType) => {
			// NOTE: 初回ロード時seriesResponseが返ってくる前にソートボタンを押した際に、assertNotNullでエラーにならないようにするため
			if (!seriesResponse) {
				return;
			}
			load({
				...getPreviousSearchSeriesCondition(),
				sort,
			});
			setSortType(sort);
			aa.events.sendSelectSortType(sort);
			window.scrollTo({ top: 0 });
		},
		[getPreviousSearchSeriesCondition, load, seriesResponse]
	);

	const query = useMemo(() => {
		return removeEmptyProperties({
			CategorySpec: stringifySpecValues(seriesResponse?.seriesSpecList ?? []),
			c_value: Flag.isTrue(seriesResponse?.cValue.selectedFlag)
				? '1'
				: undefined,
			HyjnNoki: seriesResponse?.daysToShipList
				.find(selected)
				?.daysToShip.toString(),
			list: ItemListName.PAGE_CATEGORY,
		});
	}, [
		seriesResponse?.cValue.selectedFlag,
		seriesResponse?.seriesSpecList,
		seriesResponse?.daysToShipList,
	]);

	useEffect(() => {
		if (dispTypeQuery === 'dispList') {
			setDisplayType(SpecSearchDispType.LIST);
			return;
		}

		if (dispTypeQuery === 'dispPhoto') {
			setDisplayType(SpecSearchDispType.PHOTO);
			return;
		}

		if (seriesResponse?.specSearchDispType === SpecSearchDispType.LIST) {
			setDisplayType(SpecSearchDispType.LIST);
			return;
		}

		if (seriesResponse?.specSearchDispType === SpecSearchDispType.PHOTO) {
			setDisplayType(SpecSearchDispType.PHOTO);
			return;
		}

		// NOTE: If not specified, set display to Photo Mode.
		setDisplayType(SpecSearchDispType.PHOTO);
	}, [dispTypeQuery, seriesResponse?.specSearchDispType]);

	useEffect(() => {
		if (!seriesResponse) {
			return;
		}
		const payload = seriesResponse.seriesList.map(series => ({
			seriesCode: series.seriesCode ?? '',
			itemListName: ItemListName.PAGE_CATEGORY,
		}));
		ga.ecommerce.viewItemList(payload);
	}, [seriesResponse]);

	return (
		<Presenter
			category={category}
			categoryName={categoryName}
			categoryCode={categoryCode}
			topCategoryCode={topCategoryCode}
			categoryList={categoryList}
			seriesResponse={seriesResponse}
			loading={loading || loadingCategory}
			totalCount={seriesResponse?.totalCount ?? 0}
			brandList={seriesResponse?.brandList ?? []}
			cValue={seriesResponse?.cValue}
			onChangeDisplayType={handleChangeDisplayType}
			sortType={sortType}
			onChangeSortType={handleChangeSortType}
			displayType={displayType}
			page={page}
			pageSize={PAGE_SIZE}
			onChangePage={handleChangePage}
			seriesSpecList={seriesResponse?.seriesSpecList ?? []}
			daysToShipList={seriesResponse?.daysToShipList ?? []}
			onChangeSpecs={handleChangeSpec}
			onClear={handleClearFilter}
			query={query}
		/>
	);
};
SeriesList.displayName = 'SeriesList';

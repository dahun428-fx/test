import { Canceler } from 'axios';
import { useRouter } from 'next/router';
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { usePageSize } from './SeriesList/SeriesList.hooks';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { Option as DisplayTypeOption } from '@/components/pc/ui/controls/select/DisplayTypeSwitch';
import { config } from '@/config';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { Flag } from '@/models/api/Flag';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import {
	SearchSeriesResponse$search,
	SpecViewType,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { SeriesSortType } from '@/models/pages/category';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectDaysToShipList,
	selectParams,
} from '@/store/modules/pages/category';
import {
	clearAllSelectedFilter,
	searchSeries,
} from '@/store/modules/pages/category/operations';
import { getValidCadType } from '@/utils/cad';
import { first } from '@/utils/collection';
import {
	getDefaultDisplayType,
	getSeriesListPageSize,
} from '@/utils/domain/spec';
import { removeEmptyProperties } from '@/utils/object';
import { getOneParams } from '@/utils/query';

type SpecSearchContext = {
	loading: boolean;
	pageSize: number;
	currentPage: number;
	conditions?: QueryCondition;
	daysToShip?: number;
	sortType: string;
	isShowDaysToShipSelect: boolean;
	defaultDisplayType: DisplayTypeOption;
	onChangeDisplayType: (displayType: DisplayTypeOption) => void;
	reload: (conditions: SearchSeriesRequest) => Promise<void>;
	onChangePageSize: (pageSize: number) => void;
	onChangePage: (page: number) => void;
	onChangeDaysToShip: () => void;
	onChangeSortType: (sortType: string) => void;
	onClearAll: () => void;
};

type ProviderProps = {
	categoryCode: string;
	seriesResponse?: SearchSeriesResponse$search;
};

export type QueryCondition = Partial<
	Record<'CategorySpec' | 'Brand' | 'CAD' | 'HyjnNoki', string>
>;

const DEFAULT_PAGE = 1;

/** Spec search context */
const Context = createContext<SpecSearchContext>({
	loading: false,
	defaultDisplayType: DisplayTypeOption.LIST,
	currentPage: DEFAULT_PAGE,
	pageSize: getSeriesListPageSize(),
	sortType: SeriesSortType.POPULARITY,
	isShowDaysToShipSelect: false,
	reload: async () => {
		// noop
	},
	onChangeDisplayType() {
		// noop
	},
	onChangePageSize() {
		// noop
	},
	onChangePage() {
		// noop
	},
	onChangeDaysToShip() {
		// noop
	},
	onChangeSortType() {
		// noop
	},
	onClearAll() {
		// noop
	},
});

/** Spec search provider */
export const SpecSearchProvider: React.FC<ProviderProps> = ({
	categoryCode,
	seriesResponse,
	children,
}) => {
	const cancelerRef = useRef<Canceler>();
	const { generateToken } = useApiCancellation();
	const router = useRouter();
	const params = getOneParams(router.query, 'Page');
	const defaultQuery = getOneParams(
		router.query,
		'Brand',
		'CategorySpec',
		'CAD',
		'HyjnNoki',
		'DispMethod'
	);
	const page = params.Page ? parseInt(params.Page) : DEFAULT_PAGE;
	const store = useStore();
	const daysToShipList = useSelector(selectDaysToShipList);
	const [pageSize, setPageSize] = usePageSize();
	const [loading, startToLoad, endLoading] = useBoolState(false);
	const [currentPage, setCurrentPage] = useState(page);
	const [daysToShip, setDaysToShip] = useState<number>();
	const [sortType, setSortType] = useState<string>(SeriesSortType.POPULARITY);
	const [displayType, setDisplayType] = useState(defaultQuery.DispMethod);
	const [conditions, setConditions] = useState<QueryCondition>(
		removeEmptyProperties({
			...defaultQuery,
			CAD: getValidCadType(defaultQuery.CAD),
		})
	);

	const isCenterSpec = useMemo(() => {
		if (!seriesResponse) {
			return false;
		}

		return seriesResponse.seriesSpecList.some(
			spec => spec.specViewType === SpecViewType.CENTER
		);
	}, [seriesResponse]);

	const defaultDisplayType = getDefaultDisplayType({
		displayTypeQuery: displayType,
		seriesDisplayType: seriesResponse?.specSearchDispType,
	});
	const isShowDaysToShipSelect = daysToShipList.length > 0 && !isCenterSpec;

	const load = useCallback(
		async (conditions: SearchSeriesRequest) => {
			try {
				startToLoad();
				cancelerRef.current?.();
				await searchSeries(store)(
					{
						page: currentPage,
						pageSize,
						categoryCode,
						sort: sortType,
						allSpecFlag: Flag.TRUE,
						...conditions,
					},
					generateToken(c => (cancelerRef.current = c))
				);
				setCurrentPage(conditions.page ?? DEFAULT_PAGE);
				setPageSize(conditions.pageSize ?? getSeriesListPageSize());
				const latestParams = selectParams(store.getState());
				setConditions(latestParams);
			} catch (error) {
				if (error instanceof ApiCancelError) {
					// NOTE: No operation on occurred API cancel error.
					return;
				}
				throw error;
			} finally {
				endLoading();
			}
		},
		[
			categoryCode,
			currentPage,
			endLoading,
			generateToken,
			pageSize,
			setPageSize,
			sortType,
			startToLoad,
			store,
		]
	);

	const handleChangePageSize = useCallback(
		(selectedPageSize: number) => {
			const defaultPageSize = config.pagination.series.size;
			const minPageSize = first(config.pagination.series.sizeList);
			const seriesTotalCount = seriesResponse?.totalCount;

			setPageSize(selectedPageSize);
			setCurrentPage(DEFAULT_PAGE);

			if (!seriesTotalCount || !minPageSize) {
				return;
			}

			if (
				seriesTotalCount > defaultPageSize ||
				(seriesTotalCount > minPageSize &&
					(pageSize === minPageSize || selectedPageSize === minPageSize))
			) {
				load({ pageSize: selectedPageSize, page: DEFAULT_PAGE });
			}
		},
		[load, pageSize, seriesResponse?.totalCount, setPageSize]
	);

	const handleChangePage = useCallback(
		(page: number) => {
			if (page === currentPage) {
				return;
			}
			load({ page, pageSize });
		},
		[currentPage, load, pageSize]
	);

	const handleChangeDaysToShip = useCallback(
		(daysToShip?: number) => {
			setDaysToShip(daysToShip);
			load({ daysToShip, pageSize, page: DEFAULT_PAGE });
		},
		[load, pageSize]
	);

	const handleChangeSortType = useCallback(
		(sortType: string) => {
			setSortType(sortType);
			load({ sort: sortType, pageSize, page: DEFAULT_PAGE });
			aa.events.sendSelectSortType(sortType);
		},
		[load, pageSize]
	);

	const handleClearAll = useCallback(async () => {
		startToLoad();
		await clearAllSelectedFilter(store)({
			categoryCode,
			pageSize,
			page: DEFAULT_PAGE,
		});
		setConditions({});
		setCurrentPage(DEFAULT_PAGE);
		setDaysToShip(undefined);
		endLoading();
	}, [categoryCode, endLoading, pageSize, startToLoad, store]);

	const handleChangeDisplayType = useCallback(
		(displayType: DisplayTypeOption) => {
			setDisplayType(displayType);
		},
		[]
	);

	useEffect(() => {
		// NOTE: When daysToShipList is empty , not show select
		if (daysToShipList.length > 0) {
			const defaultSelected = daysToShipList.find(daysToShip =>
				Flag.isTrue(daysToShip.selectedFlag)
			);
			setDaysToShip(defaultSelected?.daysToShip);
		}
	}, [daysToShipList]);

	return (
		<Context.Provider
			value={{
				currentPage,
				loading,
				pageSize,
				daysToShip,
				sortType,
				isShowDaysToShipSelect,
				conditions,
				defaultDisplayType,
				reload: load,
				onChangeDisplayType: handleChangeDisplayType,
				onChangePageSize: handleChangePageSize,
				onChangePage: handleChangePage,
				onChangeDaysToShip: handleChangeDaysToShip,
				onChangeSortType: handleChangeSortType,
				onClearAll: handleClearAll,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useSpecSearchContext = () => useContext(Context);

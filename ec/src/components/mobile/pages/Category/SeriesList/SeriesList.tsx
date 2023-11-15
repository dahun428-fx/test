import { useEffect, useState, VFC } from 'react';
import { ListView } from './ListView';
import { Meta } from './Meta';
import { PhotoView } from './PhotoView';
import { RelatedCategory } from './RelatedCategory';
import styles from './SeriesList.module.scss';
import { SpecPanel } from './SpecPanel';
import { SpecSearchHeader } from './SpecSearchHeader';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { Breadcrumbs } from '@/components/mobile/pages/Category/Breadcrumbs';
import { PageLoader } from '@/components/mobile/ui/loaders';
import { Pagination } from '@/components/mobile/ui/paginations';
import { useBoolState } from '@/hooks/state/useBoolState';
import { SpecSearchDispType } from '@/models/api/constants/SpecSearchDispType';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import {
	Brand,
	CValue,
	SearchSeriesResponse$search,
	DaysToShip,
	SeriesSpec,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { SeriesSortType } from '@/models/pages/category';
import type { SharedOptionalQuery } from '@/pages/vona2/detail/[seriesCode].types';

type Props = {
	category: Category;
	categoryName: string;
	categoryCode: string;
	topCategoryCode: string;
	categoryList: Category[];
	seriesResponse?: SearchSeriesResponse$search;
	loading: boolean;
	totalCount: number;
	displayType?: SpecSearchDispType;
	brandList: Brand[];
	cValue?: CValue;
	page?: number;
	pageSize: number;
	query: SharedOptionalQuery;
	onChangePage: (page: number) => void;
	onChangeSpecs: (payload: ChangePayload) => void;
	onChangeDisplayType: () => void;
	sortType: SeriesSortType;
	onChangeSortType: (sort: SeriesSortType) => void;
	seriesSpecList: SeriesSpec[];
	daysToShipList: DaysToShip[];
	onClear: () => void;
};

// NOTE: 2023/3/27時点の調整済み切替スクロール値
const BORDER = 550;

export const SeriesList: VFC<Props> = ({
	category,
	categoryName,
	categoryCode,
	topCategoryCode,
	categoryList,
	seriesResponse,
	loading,
	totalCount,
	seriesSpecList,
	daysToShipList,
	displayType,
	brandList,
	cValue,
	page: currentPage,
	pageSize,
	query,
	sortType,
	onChangePage,
	onChangeSpecs,
	onChangeDisplayType,
	onChangeSortType,
	onClear,
}) => {
	const [exceedsThreshold, setExceedsThreshold] = useState<boolean>(false);
	const [showsSpecPanel, , close, toggle] = useBoolState(false);

	useEffect(() => {
		// NOTE: if-else の形式で条件分岐すると スクロール時に画面がちらつく為、以下のようにすることでそれを抑えている。
		const onScroll = () => {
			if (window.scrollY > BORDER) {
				setExceedsThreshold(true);
			}

			if (window.scrollY <= BORDER) {
				setExceedsThreshold(false);
			}
		};
		onScroll();
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<>
			<Meta
				category={category}
				categoryList={categoryList}
				seriesResponse={seriesResponse}
			/>

			<SpecSearchHeader
				categoryName={categoryName}
				loading={loading}
				count={totalCount}
				exceedsThreshold={exceedsThreshold}
				onClickFilterButton={toggle}
				displayType={displayType}
				onChangeDisplayType={onChangeDisplayType}
				sortType={sortType}
				onChangeSortType={onChangeSortType}
			/>

			{showsSpecPanel && (
				<SpecPanel
					specList={seriesSpecList}
					daysToShipList={daysToShipList}
					totalCount={totalCount}
					brandList={brandList}
					cValue={cValue}
					onChange={onChangeSpecs}
					onClear={onClear}
					onClose={close}
				/>
			)}
			<div>
				{loading ? (
					<PageLoader />
				) : displayType === SpecSearchDispType.LIST ? (
					<ListView
						seriesList={seriesResponse?.seriesList ?? []}
						currencyCode={seriesResponse?.currencyCode}
						query={query}
						loading={!showsSpecPanel && loading}
					/>
				) : (
					<PhotoView
						seriesList={seriesResponse?.seriesList ?? []}
						currencyCode={seriesResponse?.currencyCode}
						query={query}
						loading={!showsSpecPanel && loading}
					/>
				)}
				<div className={styles.pagination}>
					<Pagination
						page={currentPage ?? 1}
						pageSize={pageSize}
						queryParamKeys={['CategorySpec', 'DispMethod']}
						onChange={onChangePage}
						totalCount={totalCount ?? 0}
					/>
				</div>
			</div>
			<RelatedCategory
				topCategoryCode={topCategoryCode}
				categoryCode={categoryCode}
				categoryList={categoryList}
			/>
			<Breadcrumbs
				categoryCode={categoryCode}
				topCategory={categoryList[0]}
				seriesResponse={seriesResponse}
				page={currentPage}
			/>
		</>
	);
};

import classNames from 'classnames';
import {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	VFC,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import {
	DisplayTypeSwitch,
	Option as DisplayTypeOption,
} from './DisplayTypeSwitch';
import styles from './SeriesList.module.scss';
import { SpecComparison } from './SpecComparison';
import { Section } from '@/components/pc/domain/category/Section';
import { SeriesListControl } from '@/components/pc/domain/category/SeriesList';
import { SeriesTile } from '@/components/pc/domain/category/SeriesList/SeriesTile';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Pagination } from '@/components/pc/ui/paginations';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getHeight } from '@/utils/dom';

type Props = {
	className?: string;
	categoryCode: string;
	seriesResponse: SearchSeriesResponse$search;
	stickyBottomSelector: string;
	page: number;
	pageSize: number;
	daysToShip?: number;
	sortType: string;
	loading: boolean;
	isShowDaysToShipSelect: boolean;
	defaultDisplayType: DisplayTypeOption;
	onChangeDisplayType: (displayType: DisplayTypeOption) => void;
	onChangePage: (nextPage: number) => void;
	onChangePageSize: (selectedPageSize: number) => void;
	onChangeDaysToShip: (daysToShip?: number) => void;
	onChangeSortType: (sortType: string) => void;
};

const SCROLLBAR_HEIGHT = 11;

/** Series list component */
export const SeriesList: VFC<Props> = ({
	seriesResponse,
	stickyBottomSelector,
	categoryCode,
	page,
	pageSize,
	daysToShip,
	sortType,
	loading,
	isShowDaysToShipSelect,
	defaultDisplayType,
	onChangeDisplayType,
	onChangePage,
	onChangePageSize,
	onChangeDaysToShip,
	onChangeSortType,
}) => {
	const [stickyTop, setStickyTop] = useState(SCROLLBAR_HEIGHT);
	const headerBarRef = useRef<HTMLDivElement>(null);

	const {
		totalCount,
		seriesList,
		seriesSpecList,
		daysToShipList,
		cadTypeList,
		currencyCode,
	} = seriesResponse;

	const content = useMemo(() => {
		if (defaultDisplayType === DisplayTypeOption.DETAIL) {
			return (
				<SpecComparison
					cadTypeList={cadTypeList}
					seriesList={seriesList}
					seriesSpecList={seriesSpecList}
					currencyCode={currencyCode}
					stickyTop={stickyTop}
				/>
			);
		}

		return (
			<ul
				className={classNames(styles.seriesListWrapper, {
					[String(styles.horizontalList)]:
						defaultDisplayType === DisplayTypeOption.PHOTO,
				})}
			>
				{seriesList?.map(series => (
					<SeriesTile
						displayType={defaultDisplayType}
						key={series.seriesCode}
						series={series}
						currencyCode={currencyCode}
						specList={seriesResponse.specList}
					/>
				))}
			</ul>
		);
	}, [
		cadTypeList,
		currencyCode,
		defaultDisplayType,
		seriesList,
		seriesResponse.specList,
		seriesSpecList,
		stickyTop,
	]);

	useLayoutEffect(() => {
		// calculate sticky top position
		if (!headerBarRef.current) {
			return;
		}

		const onResize = () => {
			if (headerBarRef.current) {
				const selectorHeight = getHeight(headerBarRef.current) ?? 0;
				setStickyTop(selectorHeight);
			}
		};

		const observer = new ResizeObserver(onResize);

		if (headerBarRef) {
			observer.observe(headerBarRef.current);
		}

		return () => observer.disconnect();
	}, [headerBarRef]);

	useEffect(() => {
		const payload = seriesResponse.seriesList.map(series => ({
			seriesCode: series.seriesCode ?? '',
			itemListName: ItemListName.PAGE_CATEGORY,
		}));
		ga.ecommerce.viewItemList(payload);
	}, [seriesResponse]);

	return (
		<>
			<Section
				headerBarRef={headerBarRef}
				stickyBottomSelector={stickyBottomSelector}
				className={styles.section}
				totalCount={totalCount}
				aside={
					<DisplayTypeSwitch
						value={defaultDisplayType}
						options={[
							DisplayTypeOption.LIST,
							DisplayTypeOption.PHOTO,
							DisplayTypeOption.DETAIL,
						]}
						onChange={onChangeDisplayType}
					/>
				}
			/>

			<SeriesListControl
				categoryCode={categoryCode}
				isShowDaysToShipSelect={isShowDaysToShipSelect}
				pageSize={pageSize}
				page={page}
				daysToShip={daysToShip}
				sortType={sortType}
				totalCount={totalCount}
				daysToShipList={daysToShipList}
				onChangePageSize={onChangePageSize}
				onChangePage={onChangePage}
				onChangeDaysToShip={onChangeDaysToShip}
				onChangeSortType={onChangeSortType}
			/>
			{loading ? (
				<div>
					<BlockLoader />
				</div>
			) : (
				content
			)}
			<div className={styles.paginationWrapper}>
				<Pagination
					page={page}
					pageSize={pageSize}
					totalCount={totalCount}
					queryParamKeys={['CategorySpec', 'DispMethod']}
					onChange={onChangePage}
				/>
			</div>
		</>
	);
};
SeriesList.displayName = 'SeriesList';

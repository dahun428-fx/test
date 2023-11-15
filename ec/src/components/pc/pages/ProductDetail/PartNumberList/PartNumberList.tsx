import Router from 'next/router';
import React, {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import ResizeObserver from 'resize-observer-polyfill';
import { PartNumberAsideColumns, SortValue } from './PartNumberAsideColumns';
import { PartNumberColumn } from './PartNumberColumn';
import styles from './PartNumberList.module.scss';
import { PartNumberSpecColumns } from './PartNumberSpecColumns';
import { RowActions } from '@/components/pc/pages/ProductDetail/PartNumberList/PartNumberList.type';
import { SectionHeading } from '@/components/pc/pages/ProductDetail/templates/Complex/SectionHeading';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Pagination } from '@/components/pc/ui/paginations';
import { PageSizeSelect } from '@/components/pc/ui/radio/PageSizeSelect';
import { CurrencyProvider } from '@/components/pc/ui/text/Price';
import { Flag } from '@/models/api/Flag';
import {
	SearchPartNumberRequest,
	Sort,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { Cookie, setCookie } from '@/utils/cookie';
import { getChildren, getHeight } from '@/utils/dom';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { notNull } from '@/utils/predicate';

type Props = {
	seriesCode: string;
	currencyCode?: string;
	totalCount: number;
	partNumberList: PartNumber[];
	specList: Spec[];
	relatedLinkFrameFlag: Flag;
	rohsFrameFlag: Flag;
	stickyTop: number;
	reload: (condition: Partial<SearchPartNumberRequest>) => void;
	loading: boolean;
	page: number;
	sortParams?: Sort | Sort[];
};

const PAGINATION_QUERY_PARAMS = ['CategorySpec', 'CAD', 'HyjnNoki'] as const;

export const PartNumberList: React.VFC<Props> = ({
	seriesCode,
	currencyCode,
	totalCount,
	partNumberList,
	specList,
	relatedLinkFrameFlag,
	rohsFrameFlag,
	stickyTop,
	reload,
	loading,
	page,
	sortParams,
}) => {
	const { t } = useTranslation();

	// each table refs(part number / specs / aside(price, lead time))
	const partNumberHeaderRef = useRef<HTMLTableSectionElement>(null);
	const partNumberBodyRef = useRef<HTMLTableSectionElement>(null);
	const specHeaderRef = useRef<HTMLTableSectionElement>(null);
	const specBodyRef = useRef<HTMLTableSectionElement>(null);
	const asideHeaderRef = useRef<HTMLTableSectionElement>(null);
	const asideBodyRef = useRef<HTMLTableSectionElement>(null);

	// UI
	const [headerHeight, setHeaderHeight] = useState<number>();
	const [eachRowHeight, setEachRowHeight] = useState<number[]>([]);
	const [cursor, setCursor] = useState(-1);

	const sortValue: SortValue = useMemo(() => {
		const sortArray = !sortParams
			? []
			: Array.isArray(sortParams)
			? sortParams
			: [sortParams];

		return sortArray.reduce<SortValue>(
			(previous, current) => {
				if (
					current === Sort.STANDARD_UNIT_PRICE_ASC ||
					current === Sort.STANDARD_UNIT_PRICE_DESC
				) {
					previous.price = current;
				}

				if (
					current === Sort.SHIP_TO_DAYS_ASC ||
					current === Sort.SHIP_TO_DAYS_DESC
				) {
					previous.daysToShip = current;
				}
				return previous;
			},
			{ price: null, daysToShip: null }
		);
	}, [sortParams]);

	const sort = useMemo(() => {
		return [sortValue.price, sortValue.daysToShip].filter(notNull);
	}, [sortValue]);

	const rowActions = useMemo<RowActions>(() => {
		return {
			onMouseOver: (index: number) => setCursor(index),
			onMouseLeave: () => setCursor(-1),
			onClick(index: number) {
				const partNumber = partNumberList[index];
				assertNotNull(partNumber);
				reload({
					partNumber: partNumber.partNumber,
					innerCode: partNumber.innerCode,
					sort,
				});
			},
		};
	}, [partNumberList, reload, sort]);

	const key = partNumberList.map(({ partNumber }) => partNumber).join('\t');

	// search conditions
	const [pageSize, setPageSize] = useState(
		getPartNumberPageSize(Router.query.Tab)
	);

	const handleChangeSortValue = useCallback(
		(value: Partial<SortValue>) => {
			const nextValue = { ...sortValue, ...value };
			reload({
				pageSize,
				sort: [nextValue.price, nextValue.daysToShip].filter(notNull),
			});
		},
		[pageSize, reload, sortValue]
	);

	const handleChangePage = useCallback(
		(page: number) => {
			reload({
				pageSize,
				page,
				sort,
			});
		},
		[pageSize, reload, sort]
	);

	const handleChangePageSize = useCallback(
		(pageSize: number) => {
			setCookie(Cookie.VONA_ITEM_DETAIL_PER_PAGE, pageSize.toString());
			setPageSize(pageSize);
			reload({
				pageSize,
				sort,
			});
		},
		[reload, sort]
	);

	useLayoutEffect(() => {
		// calculate each row height on resize
		if (specHeaderRef.current == null || specBodyRef.current == null) {
			return;
		}

		const onResize = () => {
			assertNotNull(partNumberHeaderRef.current);
			assertNotNull(partNumberBodyRef.current);
			assertNotNull(specHeaderRef.current);
			assertNotNull(specBodyRef.current);
			assertNotNull(asideHeaderRef.current);
			assertNotNull(asideBodyRef.current);

			setHeaderHeight(
				Math.max(
					getHeight(partNumberHeaderRef.current),
					getHeight(specHeaderRef.current),
					getHeight(asideHeaderRef.current)
				)
			);

			const partNumberRows = getChildren(partNumberBodyRef.current);
			const specRows = getChildren(specBodyRef.current);
			const asideRows = getChildren(asideBodyRef.current);

			setEachRowHeight(
				partNumberRows.map((partNumberRow, index) => {
					const specRow = specRows[index];
					const asideRow = asideRows[index];
					assertNotNull(specRow);
					assertNotNull(asideRow);

					return Math.max(
						getHeight(partNumberRow),
						getHeight(specRow),
						getHeight(asideRow)
					);
				})
			);
		};

		onResize();
		const observer = new ResizeObserver(onResize);
		observer.observe(specHeaderRef.current);
		observer.observe(specBodyRef.current);
		return () => observer.disconnect();
	}, [partNumberList]);

	return (
		<CurrencyProvider ccyCode={currencyCode}>
			<div id="codeList">
				<SectionHeading title={t('pages.productDetail.partNumberList.title')} />
				<div className={styles.head}>
					<PageSizeSelect pageSize={pageSize} onChange={handleChangePageSize} />
					<Pagination
						page={page}
						pageSize={pageSize}
						totalCount={totalCount}
						queryParamKeys={PAGINATION_QUERY_PARAMS}
						onChange={handleChangePage}
					/>
				</div>
				<div className={styles.mainOuter}>
					{/* Search Result */}
					<div className={styles.main}>
						<PartNumberColumn
							key={`partNumber-${key}`}
							seriesCode={seriesCode}
							partNumberList={partNumberList}
							headerRef={partNumberHeaderRef}
							bodyRef={partNumberBodyRef}
							headerHeight={headerHeight}
							eachRowHeight={eachRowHeight}
							cursor={cursor}
							rowActions={rowActions}
							stickyTop={stickyTop}
							className={styles.partNumberColumn}
						/>
						<PartNumberSpecColumns
							key={`spec-${key}`}
							partNumberList={partNumberList}
							specList={specList}
							relatedLinkFrameFlag={relatedLinkFrameFlag}
							rohsFrameFlag={rohsFrameFlag}
							headerRef={specHeaderRef}
							bodyRef={specBodyRef}
							headerHeight={headerHeight}
							eachRowHeight={eachRowHeight}
							cursor={cursor}
							rowActions={rowActions}
							stickyTop={stickyTop}
							className={styles.specColumns}
						/>
						<PartNumberAsideColumns
							key={`aside-${key}`}
							partNumberList={partNumberList}
							sortValue={sortValue}
							onChangeSortValue={handleChangeSortValue}
							headerRef={asideHeaderRef}
							bodyRef={asideBodyRef}
							headerHeight={headerHeight}
							eachRowHeight={eachRowHeight}
							cursor={cursor}
							rowActions={rowActions}
							stickyTop={stickyTop}
							className={styles.asideColumns}
						/>
					</div>
					{loading && <BlockLoader className={styles.loader} />}
				</div>
				<div className={styles.foot}>
					<Pagination
						page={page}
						pageSize={pageSize}
						totalCount={totalCount}
						queryParamKeys={PAGINATION_QUERY_PARAMS}
						onChange={handleChangePage}
					/>
				</div>
			</div>
		</CurrencyProvider>
	);
};
PartNumberList.displayName = 'PartNumberList';

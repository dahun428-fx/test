import classNames from 'classnames';
import NextLink from 'next/link';
import {
	FC,
	ReactNode,
	RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './SpecValueColumn.module.scss';
import { SpecValueHeader } from './SpecValueHeader';
import { StandardPrice } from './StandardPrice';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { SeriesDiscount } from '@/components/pc/domain/series/SeriesDiscount';
import { HorizontalScrollBar } from '@/components/pc/ui/controls/interaction/HorizontalScrollBar';
import { EconomyLabel } from '@/components/pc/ui/labels';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import {
	Series,
	SeriesSpec,
	ComparisonSpecValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { pagesPath } from '@/utils/$path';
import { assertNotNull } from '@/utils/assertions';
import { getWidth } from '@/utils/dom';
import { getSeriesNameDisp } from '@/utils/domain/series';
import { notEmpty } from '@/utils/predicate';
import { convertToURLString } from '@/utils/url';

type Props = {
	seriesList: Series[];
	seriesSpecList: SeriesSpec[];
	currencyCode?: string;
	hasCadType: boolean;
	fixedBodyRef: RefObject<HTMLTableSectionElement>;
	scrollBodyRef: RefObject<HTMLTableSectionElement>;
	stickyHeights: number[];
	scrollHeights: number[];
	stickyTop: number;
	specValueContainerWidth: number;
};

const SPEC_VALUE_FALLBACK = '-';

function searchComparisonSpecValue(
	comparisonSpecValueList: ComparisonSpecValue[],
	specCode: string
) {
	const value = comparisonSpecValueList.find(
		comparisonSpecValue => comparisonSpecValue.specCode === specCode
	);

	if (!value || !value.specValueDisp?.length) {
		return SPEC_VALUE_FALLBACK;
	}

	return value.specValueDisp;
}

/** Spec value column component */
export const SpecValueColumn: FC<Props> = ({
	seriesList,
	seriesSpecList,
	currencyCode,
	hasCadType,
	fixedBodyRef,
	scrollBodyRef,
	stickyHeights,
	scrollHeights,
	stickyTop,
	specValueContainerWidth,
}) => {
	const [t] = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const { conditions } = useSpecSearchContext();
	const [overflow, setOverflow] = useState(true);
	const [percent, setPercent] = useState<number>(0);
	const tableWrapperRef = useRef<HTMLDivElement>(null);
	const [tableWidth, setTableWidth] = useState<number | null>(null);

	const tableLeft = tableWidth
		? (-tableWidth + specValueContainerWidth) * percent
		: 0;

	const handleClick = useCallback(
		(seriesCode: string) => {
			ga.ecommerce.selectItem({
				seriesCode,
				itemListName: ItemListName.PAGE_CATEGORY,
			});

			const seriesUrl = pagesPath.vona2.detail._seriesCode(seriesCode).$url({
				query: conditions,
			});

			window.open(
				`${convertToURLString({
					...seriesUrl,
					query: { ...seriesUrl.query, list: ItemListName.PAGE_CATEGORY },
				})}`
			);
		},
		[conditions]
	);

	const headerContent = useMemo(() => {
		const headerInfos: ReactNode[] = [];
		const brandNames: ReactNode[] = [];
		const seriesNames: ReactNode[] = [];
		const cads: ReactNode[] = [];
		const prices: ReactNode[] = [];
		const daysToShips: ReactNode[] = [];

		seriesList.forEach((series, index) => {
			const isFirstCell = index === 0;
			const { seriesCode } = series;
			const seriesUrl = pagesPath.vona2.detail._seriesCode(seriesCode).$url({
				query: conditions,
			});

			headerInfos.push(
				<td
					className={classNames(styles.tableCell, styles.specNameCell, {
						[String(styles.firstCell)]: isFirstCell,
					})}
					key={seriesCode}
				>
					<SpecValueHeader
						key={seriesCode}
						series={series}
						seriesUrl={convertToURLString(seriesUrl)}
						onClick={handleClick}
					/>
				</td>
			);
			brandNames.push(
				<td
					key={seriesCode}
					className={classNames(styles.tableCell, {
						[String(styles.firstCell)]: isFirstCell,
					})}
				>
					<div className={styles.brandWrapper}>
						<p className={styles.brandItem}>{series.brandName}</p>
						<div className={styles.economyWrapper}>
							{Flag.isTrue(series.cValueFlag) && (
								<>
									<EconomyLabel className={styles.brandItem} />
									<SeriesDiscount pictList={series.pictList} />
								</>
							)}
						</div>
					</div>
				</td>
			);

			const seriesName = Flag.isTrue(series.packageSpecFlag)
				? series.seriesName
				: getSeriesNameDisp(series, t);
			seriesNames.push(
				<td
					key={series.seriesCode}
					className={classNames(styles.tableCell, {
						[String(styles.firstCell)]: isFirstCell,
					})}
				>
					<p className={styles.seriesName}>
						<NextLink href={seriesUrl}>
							<a
								className={styles.seriesNameLink}
								target="_blank"
								onClick={() => handleClick(series.seriesCode)}
								dangerouslySetInnerHTML={{ __html: seriesName }}
							/>
						</NextLink>
					</p>
				</td>
			);

			cads.push(
				<td
					key={series.seriesCode}
					className={classNames(styles.tableCell, {
						[String(styles.firstCell)]: isFirstCell,
					})}
				>
					{notEmpty(series.cadTypeList)
						? series.cadTypeList.map((cadType, index) => (
								<span key={index}>
									{index > 0 && (
										<span className={styles.cadLinkSeparator}>/</span>
									)}
									{cadType.cadTypeDisp}
								</span>
						  ))
						: SPEC_VALUE_FALLBACK}
				</td>
			);

			prices.push(
				<td
					key={series.seriesCode}
					className={classNames(styles.tableCell, {
						[String(styles.firstCell)]: isFirstCell,
					})}
				>
					<StandardPrice series={series} currencyCode={currencyCode} />
				</td>
			);

			daysToShips.push(
				<td
					key={series.seriesCode}
					className={classNames(styles.tableCell, {
						[String(styles.firstCell)]: isFirstCell,
					})}
				>
					{Flag.isTrue(series.discontinuedProductFlag) ? (
						<span>{SPEC_VALUE_FALLBACK}</span>
					) : (
						<DaysToShip
							className={styles.leadTime}
							minDaysToShip={series.minStandardDaysToShip}
							maxDaysToShip={series.maxStandardDaysToShip}
						/>
					)}
				</td>
			);
		});

		return {
			headerInfos,
			brandNames,
			seriesNames,
			cads,
			prices,
			daysToShips,
		};
	}, [conditions, currencyCode, handleClick, seriesList, t]);

	const fixedContents = [
		headerContent.headerInfos,
		headerContent.brandNames,
		headerContent.seriesNames,
	];

	const scrollContents = useMemo(() => {
		const contents = [headerContent.prices, headerContent.daysToShips];

		if (hasCadType) {
			contents.unshift(headerContent.cads);
		}

		seriesSpecList.forEach(spec => {
			const seriesSpecs = seriesList.map((series, index) => {
				const specValueName = searchComparisonSpecValue(
					series.comparisonSpecValueList,
					spec.specCode
				);
				return (
					<td
						key={`${spec.specCode}-${series.seriesCode}`}
						className={classNames(styles.tableCell, {
							[String(styles.firstCell)]: index === 0,
						})}
						dangerouslySetInnerHTML={{ __html: specValueName }}
					/>
				);
			});

			contents.push(seriesSpecs);
		});

		return contents;
	}, [
		hasCadType,
		headerContent.cads,
		headerContent.daysToShips,
		headerContent.prices,
		,
		seriesList,
		seriesSpecList,
	]);

	// show or hide scrollbar
	useEffect(() => {
		if (!tableWidth) {
			return;
		}

		if (containerRef.current && fixedBodyRef.current) {
			setOverflow(getWidth(containerRef.current) < tableWidth);
			const observer = new ResizeObserver(([entry]) => {
				if (entry) {
					setOverflow(entry.contentRect.width < tableWidth);
				}
			});
			observer.observe(containerRef.current);
			return () => observer.disconnect();
		}
	}, [fixedBodyRef, tableWidth]);

	// Calculate table width
	useLayoutEffect(() => {
		if (!tableWrapperRef.current) {
			return;
		}

		// NOTE: let the table expand horizontally as much as it can before fixing its width
		tableWrapperRef.current.style.width = '15000px';
		const tableElement = tableWrapperRef.current.querySelector('table');
		assertNotNull(tableElement);
		const tableWidth = getWidth(tableElement);
		setTableWidth(Math.ceil(tableWidth));
		tableWrapperRef.current.style.width = 'auto';
	}, []);

	return (
		<div style={{ width: specValueContainerWidth }} ref={containerRef}>
			<Sticky
				top={stickyTop}
				innerZ={1}
				bottomBoundary="[data-second-from-bottom='true']"
			>
				<div className={styles.tableWrapper} ref={tableWrapperRef}>
					{overflow && (
						<div className={styles.scrollBarContainer}>
							<HorizontalScrollBar
								percent={percent}
								scrollBarWidth={
									tableWidth ? specValueContainerWidth / tableWidth : 0.25
								}
								onScroll={setPercent}
								className={styles.stickyBar}
								resetScrollOnResize
							/>
						</div>
					)}
					<table
						className={styles.table}
						style={{
							transform: `translateX(${tableLeft}px)`,
							width: tableWidth ?? 'auto',
						}}
					>
						<tbody ref={fixedBodyRef}>
							{fixedContents.map((header, index) => {
								return (
									<tr key={index} style={{ height: stickyHeights[index] }}>
										{header}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Sticky>
			<div className={styles.tableWrapper}>
				<table
					className={classNames(styles.table, styles.tableBottom)}
					style={{
						transform: `translateX(${tableLeft}px)`,
						width: tableWidth ?? 'auto',
					}}
				>
					<tbody ref={scrollBodyRef}>
						{scrollContents.map((content, index) => {
							return (
								<tr key={index} style={{ height: scrollHeights[index] }}>
									{content}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
SpecValueColumn.displayName = 'SpecValueColumn';

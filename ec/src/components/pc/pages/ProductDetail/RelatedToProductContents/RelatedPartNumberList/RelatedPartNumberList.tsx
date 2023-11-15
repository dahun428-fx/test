import classNames from 'classnames';
import { useEffect, VFC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuantityCell } from './QuantityCell';
import {
	useRelatedPartNumber,
	useSpecInformation,
} from './RelatedPartNumberList.hooks';
import styles from './RelatedPartNumberList.module.scss';
import { UnitPrice } from './UnitPrice';
import { HorizontalScrollBar } from '@/components/pc/ui/controls/interaction/HorizontalScrollBar';
import { SectionHeading } from '@/components/pc/ui/headings';
import { Link } from '@/components/pc/ui/links';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { config } from '@/config';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { RoHSType } from '@/models/api/constants/RoHSType';
import { PartNumber } from '@/models/api/msm/ect/relatedPartNumber/SearchRelatedPartNumberResponse';
import { pagesPath } from '@/utils/$path';
import { getMinQuantityMessage } from '@/utils/domain/partNumber';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

export type Props = {
	seriesCode: string;
	relatedLinkFrameFlag?: Flag;
	rohsFrameFlag?: Flag;
};

export const RelatedPartNumberList: VFC<Props> = ({
	seriesCode,
	relatedLinkFrameFlag,
	rohsFrameFlag,
}) => {
	const { nonStandardSpecList } = useSpecInformation();

	const {
		hasPageStandardUnitPrice,
		hasPagePiecesPerPackage,
		relatedPartNumberInfo,
	} = useRelatedPartNumber(seriesCode);

	const [t] = useTranslation();
	const [scrollBarWidth, setScrollBarWidth] = useState(0);
	const fixedTableRef = useRef<HTMLTableElement>(null);
	const dataTableRef = useRef<HTMLTableElement>(null);
	const dataTableContainerRef = useRef<HTMLDivElement>(null);
	const [tableMaxLeft, setTableMaxLeft] = useState(0);
	const [tableScrollPercent, setTableScrollPercent] = useState(0);
	const [tableWidth, setTableWidth] = useState<number>(15000);
	const [isTableFullWidth, setIsTableFullWidth] = useState(false);
	const targetHorizontal = useRef<HTMLTableElement>(null);
	const targetBackground = useRef<HTMLTableElement>(null);

	const volumeDiscountFlagDisp = useCallback(
		(partNumber: PartNumber) => {
			if (Flag.isTrue(partNumber.volumeDiscountFlag)) {
				return t('pages.productDetail.relatedPartNumberList.available');
			}
			return '-';
		},
		[t]
	);

	const rohsFlagDisp = useCallback((partNumber: PartNumber) => {
		switch (partNumber.rohsFlag) {
			// TODO: make a common function to render RoHS display value
			case RoHSType.Correspondence6:
				return '6';
			case RoHSType.Correspondence10:
				return '10';
			default:
				return '-';
		}
	}, []);
	// TODO: Make this function become common method , file PartNumber.tsx
	const getSpecValueDisp = useCallback(
		(partNumber: PartNumber, specCode: string) => {
			const specValue = partNumber.specValueList.find(
				value => value.specCode === specCode
			);
			if (specValue) {
				return specValue.specValueDisp ?? '-';
			} else {
				return '-';
			}
		},
		[]
	);

	const handleClickRohs = () => {
		openSubWindow(url.rohs, 'guide', {
			width: 990,
			height: 800,
		});
	};

	/** Recalculate table size for horizontal scrollable table */
	const recalculateTableSize = useCallback(
		(resize: boolean) => {
			if (
				!fixedTableRef.current ||
				!dataTableRef.current ||
				!dataTableContainerRef.current ||
				!relatedPartNumberInfo
			) {
				return;
			}

			const tableContainerWidth = dataTableContainerRef.current.offsetWidth;
			const tableWidth = dataTableRef.current.offsetWidth;

			dataTableRef.current.querySelectorAll('tr').forEach(row => {
				row.querySelectorAll('th, td').forEach(cell => {
					if (cell instanceof HTMLTableCellElement) {
						cell.style.width = `${cell.offsetWidth}px`;
					}
				});
			});

			if (!resize) {
				const headerRowHeights = Array.from(
					fixedTableRef.current.querySelectorAll('tr').values()
				).map(row => row.offsetHeight);

				const rowHeights = Array.from(
					dataTableRef.current.querySelectorAll('tr').values()
				).map((row, index) =>
					Math.max(row.offsetHeight, headerRowHeights[index] ?? 0)
				);

				dataTableRef.current.querySelectorAll('tr').forEach((row, index) => {
					row.querySelectorAll('td, th').forEach(cell => {
						if (cell instanceof HTMLTableCellElement) {
							cell.style.height = `${rowHeights[index]}px`;
						}
					});
				});

				fixedTableRef.current.querySelectorAll('tr').forEach((row, index) => {
					row.querySelectorAll('td, th').forEach(cell => {
						if (cell instanceof HTMLTableCellElement) {
							cell.style.height = `${rowHeights[index]}px`;
						}
					});
				});
			}

			setScrollBarWidth(tableContainerWidth / tableWidth);

			setTableMaxLeft(tableWidth - tableContainerWidth);

			const updatedTableWidth =
				tableWidth < tableContainerWidth ? tableContainerWidth : tableWidth;
			setTableWidth(updatedTableWidth);
			if (tableWidth < tableContainerWidth) {
				setIsTableFullWidth(true);
			} else {
				setIsTableFullWidth(false);
			}
		},
		[relatedPartNumberInfo]
	);

	/** Recalculate Position for sticky header table */
	const recalculatePosition = useCallback(() => {
		if (!fixedTableRef.current || !dataTableRef.current) {
			return;
		}

		// horizontal height
		const horizontalHeight = targetHorizontal.current ? 11 : 0;

		// header 'height'
		const { height: targetHeight } =
			fixedTableRef.current.rows[0]?.cells[0]?.getBoundingClientRect() ?? {};
		const { height: lastHeight } =
			fixedTableRef.current.rows[
				fixedTableRef.current.rows.length - 1
			]?.getBoundingClientRect() ?? {};
		const { top: containerTop } = fixedTableRef.current.getBoundingClientRect();

		if (
			targetHeight == null ||
			lastHeight == null ||
			dataTableRef.current.rows[0] == null ||
			fixedTableRef.current.rows[0] == null
		) {
			return;
		}

		const containerHeight = fixedTableRef.current.clientHeight;
		const scrollY = window.scrollY || window.pageYOffset;
		const start = scrollY + containerTop + (!horizontalHeight ? 11 : 0);
		const end = start + containerHeight - targetHeight - lastHeight;

		if (scrollY >= start) {
			if (scrollY <= end) {
				dataTableRef.current.rows[0].style.position = 'relative';
				dataTableRef.current.rows[0].style.top = `${scrollY - start}px`;
				fixedTableRef.current.rows[0].style.position = 'relative';
				fixedTableRef.current.rows[0].style.top = `${scrollY - start}px`;
				if (targetHorizontal.current && targetBackground.current) {
					targetBackground.current.style.height = '11px';
					targetHorizontal.current.style.top = `${
						scrollY - start + horizontalHeight
					}px`;
				}
			}
		} else {
			dataTableRef.current.rows[0].style.position = '';
			dataTableRef.current.rows[0].style.top = '';
			fixedTableRef.current.rows[0].style.position = '';
			fixedTableRef.current.rows[0].style.top = '';
			if (targetHorizontal.current && targetBackground.current) {
				targetBackground.current.style.height = '';
				targetHorizontal.current.style.top = '';
			}
		}
	}, []);

	useEffect(() => {
		recalculateTableSize(false);

		window.addEventListener('scroll', recalculatePosition);
		window.addEventListener('resize', () => recalculateTableSize(true));
		return () => {
			window.removeEventListener('scroll', recalculatePosition);
			window.removeEventListener('resize', () => recalculateTableSize(true));
		};
	}, [recalculatePosition, recalculateTableSize]);

	if (!relatedPartNumberInfo || !relatedPartNumberInfo.partNumberList.length) {
		return null;
	}

	return (
		<div className={styles.detailBottomContainer}>
			<SectionHeading>
				{t('pages.productDetail.relatedPartNumberList.productsLikeThis')}
			</SectionHeading>
			<div className={styles.container}>
				<div className={styles.backgroundHeader} ref={targetBackground} />
				<table
					className={classNames(styles.table, styles.fixedTable)}
					ref={fixedTableRef}
				>
					<thead>
						<tr>
							<th
								className={classNames(
									styles.tableHead,
									styles.tableCellFirstColumn
								)}
							>
								{t('pages.productDetail.partNumber')}
							</th>
						</tr>
					</thead>
					<tbody>
						{relatedPartNumberInfo.partNumberList.map(partNumber => (
							<tr key={partNumber.partNumber}>
								<td
									className={classNames(
										styles.tableCell,
										styles.textLeft,
										styles.tableCellFirstColumn
									)}
								>
									<Link
										href={pagesPath.vona2.detail._seriesCode(seriesCode).$url({
											query: {
												HissuCode: partNumber.partNumber,
												list: ItemListName.PRODUCT_DETAIL,
											},
										})}
										className={styles.link}
										onClick={() =>
											ga.ecommerce.selectItem({
												seriesCode,
												itemListName: ItemListName.PRODUCT_DETAIL,
											})
										}
									>
										{partNumber.partNumber}
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className={styles.scrollView} ref={dataTableContainerRef}>
					<div
						className={styles.dataTableWrapper}
						style={{ width: `${tableWidth}px` }}
					>
						<table
							className={classNames(styles.table, styles.dataTable, {
								[String(styles.dataTableFullWidth)]: isTableFullWidth,
							})}
							style={{
								left: `-${tableMaxLeft * tableScrollPercent}px`,
							}}
							ref={dataTableRef}
						>
							<thead>
								<tr>
									{Flag.isTrue(relatedLinkFrameFlag) && (
										<th className={styles.tableHead}>
											{t('pages.productDetail.relatedPartNumberList.relatedTo')}
										</th>
									)}
									{hasPageStandardUnitPrice && (
										<th className={styles.tableHead}>
											{t('pages.productDetail.standardUnitPrice')}
										</th>
									)}
									<th className={styles.tableHead}>
										{t(
											'pages.productDetail.relatedPartNumberList.minOrderQuantity'
										)}
									</th>
									<th className={styles.tableHead}>
										{t(
											'pages.productDetail.relatedPartNumberList.volumeDiscount'
										)}
									</th>
									<th className={styles.tableHead}>
										{t('pages.productDetail.relatedPartNumberList.normal')}
										<br />
										{t('pages.productDetail.relatedPartNumberList.shipDate')}
									</th>
									{Flag.isTrue(rohsFrameFlag) && (
										<th className={styles.tableHead}>
											{t('pages.productDetail.relatedPartNumberList.roHS')}
											<div
												className={styles.rohsLink}
												onClick={handleClickRohs}
											>
												<span className={styles.rohsQuestion}>?</span>
											</div>
										</th>
									)}
									{nonStandardSpecList.map(spec => {
										return (
											<th key={spec.specCode} className={styles.tableHead}>
												<span
													dangerouslySetInnerHTML={{
														__html: spec.specName,
													}}
												/>
												{spec.specUnit && (
													<>
														<br />(
														<span
															dangerouslySetInnerHTML={{
																__html: spec.specUnit ?? '',
															}}
														/>
														)
													</>
												)}
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody>
								{relatedPartNumberInfo.partNumberList.map(partNumber => (
									<tr key={partNumber.partNumber}>
										{Flag.isTrue(relatedLinkFrameFlag) && (
											<td className={styles.tableCell}>
												{partNumber.relatedLinkList.length > 0
													? partNumber.relatedLinkList.map(
															(relatedLink, index) => (
																<p key={index}>
																	<a
																		href={relatedLink.relatedInfoUrl}
																		target="_blank"
																		rel="noreferrer"
																		className={styles.link}
																	>
																		{relatedLink.relatedLinkTypeDisp ?? ''}
																	</a>
																</p>
															)
													  )
													: '-'}
											</td>
										)}
										{hasPageStandardUnitPrice && (
											<td className={styles.tableCell}>
												<UnitPrice
													campaignEndDate={partNumber.campaignEndDate}
													campaignUnitPrice={partNumber.campaignUnitPrice}
													standardUnitPrice={partNumber.standardUnitPrice}
													currencyCode={config.defaultCurrencyCode}
												/>
												{hasPagePiecesPerPackage &&
													partNumber.piecesPerPackage &&
													partNumber.piecesPerPackage.toString().trim().length >
														0 && (
														<QuantityCell
															piecesPerPackage={partNumber.piecesPerPackage}
														/>
													)}
											</td>
										)}

										<td className={styles.tableCell}>
											{getMinQuantityMessage(
												{
													minQuantity: partNumber.minQuantity,
													piecesPerPackage: partNumber.piecesPerPackage,
												},
												t
											)}
										</td>
										<td className={styles.tableCell}>
											{volumeDiscountFlagDisp(partNumber)}
										</td>
										<td className={styles.tableCell}>
											<DaysToShip
												minDaysToShip={partNumber.minStandardDaysToShip}
												maxDaysToShip={partNumber.maxStandardDaysToShip}
												className={styles.daysToShip}
											/>
										</td>

										{Flag.isTrue(rohsFrameFlag) && (
											<td className={styles.tableCell}>
												{rohsFlagDisp(partNumber)}
											</td>
										)}
										{nonStandardSpecList.map(spec => {
											return (
												<td key={spec.specCode} className={styles.tableCell}>
													<span
														dangerouslySetInnerHTML={{
															__html:
																getSpecValueDisp(partNumber, spec.specCode) ??
																'',
														}}
													/>
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{!isTableFullWidth && scrollBarWidth !== 1 && (
						<div className={styles.scrollbarWrapper} ref={targetHorizontal}>
							<HorizontalScrollBar
								percent={tableScrollPercent}
								className={styles.scrollbar}
								scrollBarWidth={scrollBarWidth}
								onScroll={percent => setTableScrollPercent(percent)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
RelatedPartNumberList.displayName = 'RelatedPartNumberList';

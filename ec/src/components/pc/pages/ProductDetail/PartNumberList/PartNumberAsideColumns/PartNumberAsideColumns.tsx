import classNames from 'classnames';
import React, { RefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './PartNumberAsideColumns.module.scss';
import { Option, SortSelect } from './SortSelect';
import { UnitPrice } from './UnitPrice';
import { RowActions } from '@/components/pc/pages/ProductDetail/PartNumberList/PartNumberList.type';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { Flag } from '@/models/api/Flag';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

type Props = {
	partNumberList: PartNumber[];
	sortValue: SortValue;
	onChangeSortValue: (sortValue: Partial<SortValue>) => void;
	headerRef: RefObject<HTMLTableSectionElement>;
	bodyRef: RefObject<HTMLTableSectionElement>;
	headerHeight?: number;
	eachRowHeight?: number[];
	cursor: number;
	rowActions: RowActions;
	stickyTop: number;
	className?: string;
};

export type PriceSortValue = '4' | '5';
export type DaysToShipSortValue = '2' | '3';
export type SortValue = {
	price: PriceSortValue | null;
	daysToShip: DaysToShipSortValue | null;
};

export const PartNumberAsideColumns: React.VFC<Props> = ({
	partNumberList,
	sortValue,
	onChangeSortValue,
	headerRef,
	bodyRef,
	headerHeight,
	eachRowHeight = [],
	cursor,
	rowActions,
	stickyTop,
	className,
}) => {
	const { t } = useTranslation();
	const oneMoreCandidates = partNumberList.length > 1;

	const priceDirection =
		sortValue.price === '4'
			? 'ASC'
			: sortValue.price === '5'
			? 'DESC'
			: undefined;
	const daysToShipDirection =
		sortValue.daysToShip === '2'
			? 'ASC'
			: sortValue.daysToShip === '3'
			? 'DESC'
			: undefined;

	const priceOptions = useMemo<Option<PriceSortValue>[]>(
		() => [
			{
				value: '4',
				label: t(
					'pages.productDetail.partNumberList.sortOption.priceLowToHigh'
				),
			},
			{
				value: '5',
				label: t(
					'pages.productDetail.partNumberList.sortOption.byHighestPrice'
				),
			},
		],
		[t]
	);

	const daysToShipOptions = useMemo<Option<DaysToShipSortValue>[]>(
		() => [
			{
				value: '2',
				label: t(
					'pages.productDetail.partNumberList.sortOption.byFastestDeliveryDate'
				),
			},
			{
				value: '3',
				label: t(
					'pages.productDetail.partNumberList.sortOption.bySlowestDeliveryDate'
				),
			},
		],
		[t]
	);

	return (
		<div className={className}>
			<Sticky
				top={stickyTop}
				innerZ={2}
				enabled={partNumberList.length > 1}
				innerActiveClass={styles.headerCover}
				bottomBoundary="[data-second-from-bottom='true']"
			>
				<table
					className={classNames(styles.headerTable, styles.scrollSideSpace)}
				>
					<thead ref={headerRef}>
						<tr style={{ height: headerHeight }}>
							<th className={styles.unitPriceHeader}>
								<div
									className={styles.headerContents}
									data-sort-direction={priceDirection}
								>
									<span className={styles.title}>
										{t('pages.productDetail.partNumberList.standardUnitPrice')}
									</span>
									<SortSelect<PriceSortValue>
										value={sortValue.price}
										options={priceOptions}
										onChange={price => onChangeSortValue({ price })}
									/>
								</div>
							</th>
							<th className={styles.leadTimeHeader}>
								<div
									className={styles.headerContents}
									data-sort-direction={daysToShipDirection}
								>
									<span className={styles.title}>
										{t('pages.productDetail.partNumberList.daysToShip')}
									</span>
									<SortSelect<DaysToShipSortValue>
										value={sortValue.daysToShip}
										options={daysToShipOptions}
										onChange={daysToShip => onChangeSortValue({ daysToShip })}
									/>
								</div>
							</th>
						</tr>
					</thead>
				</table>
			</Sticky>
			<table className={styles.table}>
				<tbody ref={bodyRef}>
					{partNumberList.map((partNumber, index) => (
						<tr
							key={`${partNumber.innerCode}\t${partNumber.partNumber}`}
							style={{ height: eachRowHeight[index] }}
							{...(oneMoreCandidates && {
								className: styles.dataRow,
								'data-hover': cursor === index,
								onClick: () => rowActions.onClick(index),
								onMouseOver: () => rowActions.onMouseOver(index),
								onMouseLeave: rowActions.onMouseLeave,
							})}
						>
							<td className={styles.dataCellBase}>
								<div className={styles.data}>
									<UnitPrice {...partNumber} />
								</div>
							</td>
							<td className={styles.daysToShipDataCell}>
								<div className={styles.data}>
									{Flag.isTrue(partNumber.discontinuedProductFlag) ? (
										'-'
									) : (
										<DaysToShip
											minDaysToShip={partNumber.minStandardDaysToShip}
											maxDaysToShip={partNumber.maxStandardDaysToShip}
											className={styles.daysToShip}
										/>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
PartNumberAsideColumns.displayName = 'PartNumberAsideColumns';

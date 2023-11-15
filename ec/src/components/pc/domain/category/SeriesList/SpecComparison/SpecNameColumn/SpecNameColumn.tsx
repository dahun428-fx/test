import classNames from 'classnames';
import React, { RefObject, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './SpecNameColumn.module.scss';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getSpecName } from '@/utils/domain/spec';

type Props = {
	seriesSpecList: SeriesSpec[];
	hasCadType: boolean;
	fixedHeaderRef: RefObject<HTMLTableSectionElement>;
	scrollHeaderRef: RefObject<HTMLTableSectionElement>;
	stickyHeights: number[];
	scrollHeights: number[];
	stickyTop: number;
};

export const COLUMN_WIDTH = 116;

/** Spec name column component */
export const SpecNameColumn: React.VFC<Props> = ({
	seriesSpecList,
	hasCadType,
	fixedHeaderRef,
	scrollHeaderRef,
	stickyHeights,
	scrollHeights,
	stickyTop,
}) => {
	const [t] = useTranslation();

	const fixedHeaders = [
		'',
		t('components.domain.category.seriesList.specComparison.brand'),
		t('components.domain.category.seriesList.specComparison.seriesName'),
	];

	const scrollHeaders = useMemo(() => {
		const headers = [
			{
				name: t(
					'components.domain.category.seriesList.specComparison.standardPrice'
				),
				isSpec: false,
			},
			{
				name: t(
					'components.domain.category.seriesList.specComparison.daysToShip'
				),
				isSpec: false,
			},
		];

		if (hasCadType) {
			headers.unshift({
				name: t('components.domain.category.seriesList.specComparison.cad'),
				isSpec: false,
			});
		}

		seriesSpecList.forEach(spec => {
			headers.push({
				name: getSpecName(spec),
				isSpec: true,
			});
		});

		return headers;
	}, [hasCadType, seriesSpecList, t]);

	return (
		<div className={styles.specNameColumn} style={{ width: COLUMN_WIDTH }}>
			<Sticky
				top={stickyTop}
				innerZ={2}
				bottomBoundary="[data-second-from-bottom='true']"
			>
				<table className={styles.fixedSpecName} style={{ width: COLUMN_WIDTH }}>
					<tbody ref={fixedHeaderRef}>
						{fixedHeaders.map((headerName, index) => {
							return (
								<tr style={{ height: stickyHeights[index] }} key={index}>
									<th
										className={classNames(
											styles.tableCell,
											styles.specNameCell
										)}
									>
										{headerName}
									</th>
								</tr>
							);
						})}
					</tbody>
				</table>
			</Sticky>
			<table
				className={classNames(styles.fixedSpecName, styles.tableBottom)}
				style={{ width: COLUMN_WIDTH }}
			>
				<tbody ref={scrollHeaderRef}>
					{scrollHeaders.map((header, index) => {
						return (
							<tr
								key={index}
								style={{ height: scrollHeights[index] }}
								data-second-from-bottom={index === scrollHeaders.length - 2}
							>
								<th
									className={classNames(styles.tableCell, styles.specNameCell)}
								>
									{header.isSpec ? (
										<span dangerouslySetInnerHTML={{ __html: header.name }} />
									) : (
										header.name
									)}
								</th>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
SpecNameColumn.displayName = 'SpecNameColumn';

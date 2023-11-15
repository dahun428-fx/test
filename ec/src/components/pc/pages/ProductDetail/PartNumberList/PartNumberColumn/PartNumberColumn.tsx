import classNames from 'classnames';
import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import { PartNumberCell } from './PartNumberCell';
import styles from './PartNumberColumn.module.scss';
import { RowActions } from '@/components/pc/pages/ProductDetail/PartNumberList/PartNumberList.type';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

type Props = {
	seriesCode: string;
	partNumberList: PartNumber[];
	headerRef: RefObject<HTMLTableSectionElement>;
	bodyRef: RefObject<HTMLTableSectionElement>;
	headerHeight?: number;
	eachRowHeight?: number[];
	cursor: number;
	rowActions: RowActions;
	stickyTop: number;
	className?: string;
};

export const PartNumberColumn: React.VFC<Props> = ({
	seriesCode,
	partNumberList,
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

	return (
		<div className={className}>
			<Sticky
				enabled={oneMoreCandidates}
				top={stickyTop}
				innerZ={2}
				innerActiveClass={styles.headerCover}
				bottomBoundary="[data-second-from-bottom='true']"
			>
				<table
					className={classNames(styles.headerTable, styles.scrollSideSpace)}
				>
					<thead ref={headerRef}>
						<tr style={{ height: headerHeight }}>
							<th className={styles.headerCell}>
								{t('pages.productDetail.partNumber')}
							</th>
						</tr>
					</thead>
				</table>
			</Sticky>
			<table className={styles.tableBase}>
				<tbody ref={bodyRef}>
					{partNumberList.map((partNumber, index) => (
						<tr
							key={index}
							style={{ height: eachRowHeight[index] }}
							data-second-from-bottom={index === partNumberList.length - 2}
							{...(oneMoreCandidates && {
								className: styles.dataRow,
								'data-hover': cursor === index,
								onClick: () => rowActions.onClick(index),
								onMouseOver: () => rowActions.onMouseOver(index),
								onMouseLeave: rowActions.onMouseLeave,
							})}
						>
							<PartNumberCell
								partNumber={partNumber}
								seriesCode={seriesCode}
								oneMoreCandidates={oneMoreCandidates}
							/>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
PartNumberColumn.displayName = 'PartNumberColumn';

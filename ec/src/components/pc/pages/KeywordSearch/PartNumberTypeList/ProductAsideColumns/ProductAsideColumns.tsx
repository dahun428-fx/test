import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductAsideCells } from './ProductAsideCells';
import styles from './ProductAsideColumns.module.scss';
import { NormalRowActions } from '@/components/pc/pages/KeywordSearch/PartNumberTypeList/PartNumberTypeList.types';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	typeList: Series[];
	tableRef?: RefObject<HTMLTableElement>;
	headerHeight?: string;
	rowHeightList?: string[];
	cursor: number;
	rowActions: NormalRowActions;
	className?: string;
};

/**
 * Product aside information columns
 */
export const ProductAsideColumns: React.VFC<Props> = ({
	typeList,
	tableRef,
	headerHeight,
	rowHeightList = [],
	cursor,
	rowActions,
	className,
}) => {
	const { t } = useTranslation();

	return (
		<div className={className}>
			<table className={styles.table} ref={tableRef}>
				<thead style={{ height: headerHeight }}>
					<tr className={styles.headerRowBase}>
						<th className={styles.cadHeaderCell}>
							{t('pages.keywordSearch.partNumberTypeList.cad')}
						</th>
						<th className={styles.priceLeadTimeHeaderCell}>
							{t('pages.keywordSearch.partNumberTypeList.priceLeadTime')}
						</th>
					</tr>
				</thead>
				<tbody>
					{typeList.map((type, index) => (
						<tr
							key={`${type.seriesCode}\t${type.partNumber}`}
							className={styles.dataRowBase}
							style={{ height: rowHeightList[index] }}
							{...(type.seriesStatus === SeriesStatus.NORMAL && {
								onMouseOver: () => rowActions.onMouseOver(index),
								onMouseLeave: rowActions.onMouseLeave,
								onClick: () => rowActions.onClick(index),
								'data-hover': cursor === index,
							})}
						>
							<ProductAsideCells type={type} index={index} />
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
ProductAsideColumns.displayName = 'ProductAsideColumns';

import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductBaseCell } from './ProductBaseCell';
import styles from './ProductBaseColumn.module.scss';
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
 * Product Basic information column
 */
export const ProductBaseColumn: React.VFC<Props> = ({
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
						<th className={styles.headerCell}>
							{t('pages.keywordSearch.partNumberTypeList.productInfo')}
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
							<ProductBaseCell type={type} />
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
ProductBaseColumn.displayName = 'ProductBaseColumn';

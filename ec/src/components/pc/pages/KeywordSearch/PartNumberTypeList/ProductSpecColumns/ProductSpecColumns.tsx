import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductSpecColumns.module.scss';
import { NormalRowActions } from '@/components/pc/pages/KeywordSearch/PartNumberTypeList/PartNumberTypeList.types';
import { HorizontalScrollbarContainer } from '@/components/pc/ui/controls/interaction/HorizontalScrollBar';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { PartNumberSpecTypes } from '@/store/modules/pages/keywordSearch';
import { getDocumentWidth } from '@/utils/dom';

type Props = {
	partNumberTypeSpecs: PartNumberSpecTypes;
	tableRef?: RefObject<HTMLTableElement>;
	headerHeight?: string;
	rowHeightList?: string[];
	cursor: number;
	rowActions: NormalRowActions;
	className?: string;
};

const BREAK_POINT = 950;
const COLUMN_MIN_WIDTH = 60;
const COLUMN_MAX_WIDTH = 160;

type TableStatus = 'hidden' | 'overflow' | 'normal';

/**
 * Product's Specs Columns
 */
export const ProductSpecColumns: React.VFC<Props> = ({
	partNumberTypeSpecs,
	tableRef,
	headerHeight,
	rowHeightList = [],
	cursor,
	rowActions,
	className,
}) => {
	const { specList, typeSpecValueList } = partNumberTypeSpecs;
	const { t } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const [status, setStatus] = useState<TableStatus>('normal');

	useEffect(() => {
		const onResize = () => {
			if (getDocumentWidth() < BREAK_POINT) {
				setStatus('hidden');
			} else if (
				containerRef.current &&
				containerRef.current.clientWidth < COLUMN_MIN_WIDTH * specList.length
			) {
				setStatus('overflow');
			} else {
				setStatus('normal');
			}
		};

		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [specList.length, tableRef]);

	// if no specs, display nothing.
	if (specList.length === 0 || status === 'hidden') {
		return null;
	}

	return (
		<HorizontalScrollbarContainer
			className={className}
			enabled={status === 'overflow'}
			innerStyle={{
				minWidth: `${COLUMN_MIN_WIDTH * specList.length}px`,
			}}
			ref={containerRef}
			activeInnerStyle={{
				width: `${COLUMN_MAX_WIDTH * specList.length}px`,
			}}
		>
			<table className={styles.table} ref={tableRef}>
				<thead style={{ height: headerHeight }}>
					<tr className={styles.specHeaderRow}>
						{specList.map(spec => (
							<th
								className={styles.specHeaderCell}
								key={spec.specCode}
								style={{ maxWidth: COLUMN_MAX_WIDTH }}
							>
								<p
									className={styles.specHeader}
									dangerouslySetInnerHTML={{ __html: spec.specNameDisp }}
								/>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{typeSpecValueList.map(({ seriesStatus, valueMap }, index) => (
						<tr
							className={styles.specDataRow}
							key={index}
							style={{ height: rowHeightList[index] }}
							{...(seriesStatus === SeriesStatus.NORMAL && {
								onMouseOver: () => rowActions.onMouseOver(index),
								onMouseLeave: rowActions.onMouseLeave,
								onClick: () => rowActions.onClick(index),
								'data-hover': cursor === index,
							})}
						>
							{valueMap ? (
								specList.map((spec, index) => (
									<td className={styles.specDataCell} key={index}>
										<span
											className={styles.specData}
											dangerouslySetInnerHTML={{
												__html: valueMap[spec.specCode] ?? '-',
											}}
										/>
									</td>
								))
							) : (
								<td
									className={styles.noSpecDataCell}
									colSpan={specList.length}
									key={index}
								>
									{t(
										'pages.keywordSearch.partNumberTypeList.productSpecColumns.noSpecs'
									)}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</HorizontalScrollbarContainer>
	);
};
ProductSpecColumns.displayName = 'ProductSpecColumns';

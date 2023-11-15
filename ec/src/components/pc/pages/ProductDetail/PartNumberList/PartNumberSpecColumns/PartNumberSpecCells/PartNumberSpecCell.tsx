import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from './PartNumberSpecCells.module.scss';
import { useTooltip } from '@/components/pc/ui/tooltips';
import { getHeight } from '@/utils/dom';
import { notEmpty } from '@/utils/predicate';

type Props = {
	specValue?: string;
};

export const PartNumberSpecCell: React.VFC<Props> = ({ specValue }) => {
	const { bind } = useTooltip<HTMLTableDataCellElement>({
		content: specValue,
		theme: 'light',
		closeOnClick: true,
		offset: 5,
	});
	const [maybeOverflow, setMaybeOverflow] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		// NOTE: 75px 超えてたら overflow してるかもなので tooltip を出す
		//       ただし、リサイズなどで変わったとしても無視する
		setMaybeOverflow((getHeight(contentRef) ?? 0) > 75);
	}, []);

	return (
		<td
			className={styles.dataCell}
			{...(notEmpty(specValue) && maybeOverflow && bind)}
		>
			<div
				ref={contentRef}
				className={styles.data}
				dangerouslySetInnerHTML={{
					__html: specValue ?? '-',
				}}
			/>
		</td>
	);
};
PartNumberSpecCell.displayName = 'PartNumberSpecCell';

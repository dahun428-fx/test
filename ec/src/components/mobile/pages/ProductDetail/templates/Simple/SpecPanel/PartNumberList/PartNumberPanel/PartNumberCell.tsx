import classNames from 'classnames';
import { useCallback } from 'react';
import styles from './PartNumberCell.module.scss';
import { useBoolState } from '@/hooks/state/useBoolState';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { getSpecName } from '@/utils/domain/spec';

type Props = {
	partNumber: PartNumber;
	specList: Spec[];
	selected: boolean;
	selectPartNumber: () => void;
};

export const PartNumberCell: React.VFC<Props> = ({
	partNumber,
	specList,
	selected,
	selectPartNumber,
}) => {
	const { bool: isOpen, toggle } = useBoolState(false);

	const handleClickPartNumber = useCallback(() => {
		if (!selected) {
			selectPartNumber();
		}
	}, [selected, selectPartNumber]);

	return (
		<div className={styles.cellWrapper}>
			<div
				className={classNames(styles.partNumber, {
					[String(styles.completed)]: selected,
				})}
				onClick={handleClickPartNumber}
			>
				{partNumber.partNumber}
			</div>
			<div className={styles.specList} aria-expanded={isOpen} onClick={toggle}>
				{partNumber.specValueList.map(specValue => (
					<span
						key={specValue.specCode}
						dangerouslySetInnerHTML={{
							__html: `${getSpecName(specValue.specCode, specList)}:${
								specValue.specValueDisp
							}; `,
						}}
					/>
				))}
			</div>
		</div>
	);
};
PartNumberCell.displayName = 'PartNumberCell';

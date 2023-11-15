import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberSpecCells.module.scss';
import { Label } from '@/components/pc/ui/labels';
import { useTooltip } from '@/components/pc/ui/tooltips';
import {
	getMinQuantityMessage,
	getPartNumberPackText,
} from '@/utils/domain/partNumber';

type Props = {
	minQuantity?: number;
	piecesPerPackage?: number;
};

export const MinOrderQuantityCell: React.VFC<Props> = ({
	minQuantity,
	piecesPerPackage,
}) => {
	const { t } = useTranslation();
	const { bind } = useTooltip<HTMLParagraphElement>({
		content: t('pages.productDetail.partNumberList.quantityCell.packQuantity'),
		theme: 'light',
		closeOnClick: true,
		offset: 5,
	});

	return (
		<td className={styles.dataCell}>
			<div className={styles.data}>
				{getMinQuantityMessage({ minQuantity, piecesPerPackage }, t)}
				{piecesPerPackage != null && (
					<p {...bind}>
						<Label>{getPartNumberPackText({ piecesPerPackage }, t)}</Label>
					</p>
				)}
			</div>
		</td>
	);
};
MinOrderQuantityCell.displayName = 'MinOrderQuantityCell';

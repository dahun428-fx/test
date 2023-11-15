import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './QuantityCell.module.scss';
import { Label } from '@/components/pc/ui/labels';
import { useTooltip } from '@/components/pc/ui/tooltips';
import { getPartNumberPackText } from '@/utils/domain/partNumber';

type Props = {
	piecesPerPackage: number;
};

/** Quantity cell */
export const QuantityCell: VFC<Props> = ({ piecesPerPackage }) => {
	const [t] = useTranslation();
	const { bind } = useTooltip<HTMLDivElement>({
		content: t(
			'pages.productDetail.relatedPartNumberList.quantityCell.packQuantity'
		),
		theme: 'light',
		closeOnClick: true,
		offset: 5,
	});

	return (
		<div {...bind}>
			<Label theme="info" className={styles.label}>
				{getPartNumberPackText({ piecesPerPackage }, t)}
			</Label>
		</div>
	);
};

QuantityCell.displayName = 'QuantityCell';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from './Label';
import { date } from '@/utils/date';

export type Props = {
	/** sale end date */
	saleEndDate: string;
	/** class name */
	className?: string;
};

/**
 * Sale label Component.
 */
export const SaleLabel: React.FC<Props> = ({ saleEndDate, className }) => {
	const { t } = useTranslation();
	const formattedDate = date(saleEndDate);
	return (
		// TODO: Date Format
		<Label theme="strong" className={className}>
			{t('components.ui.labels.saleLabel.caption', {
				saleEndDate: formattedDate,
			})}
		</Label>
	);
};
SaleLabel.displayName = 'SaleLabel';

import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	minQuantity: number;
	isPackage?: boolean;
	className?: string;
};

/** Minimum order quantity Text */
export const MinQuantity: React.VFC<Props> = ({
	minQuantity,
	isPackage,
	className,
}) => {
	const { t } = useTranslation();
	return (
		<p className={className}>
			{isPackage
				? t('mobile.components.ui.text.minQuantity.package', { minQuantity })
				: t('mobile.components.ui.text.minQuantity.piece', { minQuantity })}
		</p>
	);
};
MinQuantity.displayName = 'MinQuantity';

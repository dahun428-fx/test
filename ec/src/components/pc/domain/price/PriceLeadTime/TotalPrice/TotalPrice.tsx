import React from 'react';
import styles from './TotalPrice.module.scss';
import { Price } from '@/components/pc/ui/text/Price';

type Props = {
	totalPrice?: number;
	discounted?: boolean;
	currencyCode?: string;
};

/** Total price on Actions Panel */
export const TotalPrice: React.VFC<Props> = ({
	totalPrice,
	currencyCode,
	discounted,
}) => {
	if (totalPrice == null || totalPrice === 0) {
		return <span className={styles.price}>-</span>;
	}

	return (
		<Price
			value={totalPrice}
			ccyCode={currencyCode}
			theme="large-accent"
			isRed={discounted}
		/>
	);
};
TotalPrice.displayName = 'TotalPrice';

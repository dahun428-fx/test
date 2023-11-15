import React from 'react';
import styles from './TotalPrice.module.scss';
import { Price } from '@/components/mobile/ui/text/Price';

type Props = {
	totalPrice?: number;
	discounted?: boolean;
	currencyCode?: string;
};

/** Total price on Actions Panel */
export const TotalPrice: React.VFC<Props> = ({
	totalPrice,
	discounted,
	currencyCode,
}) => {
	if (totalPrice == null || totalPrice === 0) {
		return <p>---</p>;
	}

	return (
		<Price
			value={totalPrice}
			ccyCode={currencyCode}
			theme="accent"
			className={discounted ? styles.discount : undefined}
		/>
	);
};
TotalPrice.displayName = 'TotalPrice';

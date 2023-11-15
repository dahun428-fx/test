import classNames from 'classnames';
import React from 'react';
import styles from './TotalPrice.module.scss';
import { Price } from '@/components/mobile/ui/text/Price';

type Props = {
	totalPrice?: number;
	currencyCode?: string;
	isSale?: boolean;
};

/** Total price component */
export const TotalPrice = ({ totalPrice, currencyCode, isSale }: Props) => {
	if (!totalPrice) {
		return <span>---</span>;
	}

	return (
		<Price
			value={totalPrice}
			ccyCode={currencyCode}
			theme="accent"
			className={classNames({
				[String(styles.isSale)]: isSale,
			})}
		/>
	);
};

TotalPrice.displayName = 'TotalPrice';

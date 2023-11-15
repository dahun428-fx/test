import React from 'react';
import styles from './UnitPrice.module.scss';
import { Price } from '@/components/mobile/ui/text/Price';

type Props = {
	standardUnitPrice?: number;
	unitPrice?: number;
	currencyCode?: string;
};

/** Unit price on Part Number List */
export const UnitPrice: React.VFC<Props> = ({
	standardUnitPrice,
	unitPrice,
	currencyCode,
}) => {
	if (unitPrice == null || unitPrice === 0) {
		return <p>---</p>;
	}

	// Discounted
	if (standardUnitPrice && standardUnitPrice > unitPrice) {
		return (
			<div>
				<p className={styles.strike}>
					<Price value={standardUnitPrice} ccyCode={currencyCode} />
				</p>
				<p className={styles.discount}>
					<Price value={unitPrice} ccyCode={currencyCode} theme="accent" />
				</p>
			</div>
		);
	}

	return <Price value={unitPrice} ccyCode={currencyCode} />;
};
UnitPrice.displayName = 'UnitPrice';

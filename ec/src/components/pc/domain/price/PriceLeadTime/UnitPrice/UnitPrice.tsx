import Big from 'big.js';
import { t } from 'i18next';
import React from 'react';
import { Trans } from 'react-i18next';
import styles from './UnitPrice.module.scss';
import { Price } from '@/components/pc/ui/text/Price';

type Props = {
	standardUnitPrice?: number;
	unitPrice?: number;
	currencyCode?: string;
};

/** Unit price on Actions Panel */
export const UnitPrice: React.VFC<Props> = ({
	standardUnitPrice,
	unitPrice,
	currencyCode,
}) => {
	if (unitPrice == null || unitPrice === 0) {
		return <span className={styles.price}>-</span>;
	}

	// Discounted
	if (standardUnitPrice && standardUnitPrice > unitPrice) {
		return (
			<div>
				<div>
					<Price
						value={unitPrice}
						ccyCode={currencyCode}
						theme="accent"
						isRed
					/>
				</div>
				<div className={styles.strike}>
					<span>
						{t('components.domain.price.priceLeadTime.unitPrice.standardPrice')}
					</span>
					<Price value={standardUnitPrice} ccyCode={currencyCode} />
				</div>
				<div className={styles.discount}>
					<Trans i18nKey="components.domain.price.priceLeadTime.unitPrice.discount">
						<Price
							// TODO: move 2 to config
							value={Big(standardUnitPrice).minus(unitPrice).toFixed(2)}
							ccyCode={currencyCode}
						/>
					</Trans>
				</div>
			</div>
		);
	}

	return (
		<Price
			className={styles.price}
			value={unitPrice}
			ccyCode={currencyCode}
			theme="accent"
		/>
	);
};
UnitPrice.displayName = 'UnitPrice';

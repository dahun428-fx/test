import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './PriceLeadTime.module.scss';
import { TotalPrice } from './TotalPrice';
import { UnitPrice } from './UnitPrice';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import {
	daysToShipNeedsQuote,
	isPack,
	isDiscounted,
	priceNeedsQuote,
} from '@/utils/domain/price';

type Props = {
	price: Pick<
		Price,
		| 'unitPrice'
		| 'standardUnitPrice'
		| 'totalPrice'
		| 'daysToShip'
		| 'priceInquiryFlag'
		| 'daysToShipInquiryFlag'
		| 'unfitType'
		| 'largeOrderMaxQuantity'
		| 'quantity'
		| 'piecesPerPackage'
	>;
	prepend?: 'quantity' | 'unitPrice';
	isAbleToCheckout: boolean;
};

/**
 * Price and Lead time
 * Display check price result.
 */
export const PriceLeadTime: React.VFC<Props> = ({
	price,
	prepend = 'unitPrice',
	isAbleToCheckout,
}) => {
	const { quantity, piecesPerPackage } = price;
	const { t } = useTranslation();

	const unitPrice = !priceNeedsQuote(price, isAbleToCheckout)
		? price.unitPrice
		: undefined;
	const standardUnitPrice = !priceNeedsQuote(price, isAbleToCheckout)
		? price.standardUnitPrice
		: undefined;
	const totalPrice = !priceNeedsQuote(price, isAbleToCheckout)
		? price.totalPrice
		: undefined;
	const daysToShip = !daysToShipNeedsQuote(price, isAbleToCheckout)
		? price.daysToShip
		: undefined;
	const showsSameDayShippingMessage =
		!daysToShipNeedsQuote(price, isAbleToCheckout) && daysToShip === 0;

	return (
		<ul className={styles.priceDaysToShip}>
			{prepend === 'unitPrice' && (
				<li>
					<dl className={styles.unitPrice}>
						<dt className={styles.priceDaysToShipTitle}>
							{t('components.domain.price.priceLeadTime.unitPriceLabel')}
						</dt>
						<dd className={styles.unitPriceValue}>
							<UnitPrice
								unitPrice={unitPrice}
								standardUnitPrice={standardUnitPrice}
							/>
						</dd>
					</dl>
				</li>
			)}

			{prepend === 'quantity' && (
				<li>
					<dl className={styles.orderQuantity}>
						<dt className={styles.quantityLabel}>
							{t('components.domain.price.priceLeadTime.quantityLabel')}
						</dt>
						<dd className={styles.quantityValue}>
							<span className={styles.quantity}>{quantity}</span>
							{isPack(price) && (
								<span>
									{t('components.domain.price.priceLeadTime.piecesPerPackage', {
										piecesPerPackage,
									})}
								</span>
							)}
						</dd>
					</dl>
				</li>
			)}

			<li>
				<dl className={styles.totalPrice}>
					<dt className={styles.priceDaysToShipTitle}>
						{t('components.domain.price.priceLeadTime.totalAmountLabel')}
					</dt>
					<dd className={styles.totalPriceValue}>
						<TotalPrice
							totalPrice={totalPrice}
							discounted={isDiscounted(price)}
						/>
					</dd>
				</dl>
			</li>
			<li>
				<dl className={styles.daysToShip}>
					<dt className={styles.priceDaysToShipTitle}>
						{t('components.domain.price.priceLeadTime.daysToShipLabel')}
					</dt>
					<dd className={styles.daysToShipValueContainer}>
						<DaysToShip
							className={styles.daysToShipValue}
							minDaysToShip={daysToShip}
						/>
						{showsSameDayShippingMessage && (
							<div className={styles.sameDayShipping}>
								<Trans i18nKey="components.domain.price.priceLeadTime.sameDayShippingMessage">
									<strong />
								</Trans>
							</div>
						)}
					</dd>
				</dl>
			</li>
		</ul>
	);
};
PriceLeadTime.displayName = 'PriceLeadTime';

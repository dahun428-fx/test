import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './ActionsPanel.module.scss';
import { QuantityField } from '@/components/mobile/pages/ProductDetail/QuantityField';
import { Button } from '@/components/mobile/ui/buttons';
import { Loader } from '@/components/mobile/ui/loaders/Loader';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';
import { CurrencyProvider, Price } from '@/components/mobile/ui/text/Price';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Price as PriceType } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { priceNeedsQuote } from '@/utils/domain/price';

type Props = {
	partNumber: PartNumber;
	price: PriceType;
	loading?: boolean;
	check: (quantity: number | null) => void;
	addToCart: () => void;
	orderNow: () => void;
};

export const ActionsPanel: React.VFC<Props> = ({
	partNumber,
	price,
	loading,
	check,
	addToCart,
	orderNow,
}) => {
	const { t } = useTranslation();

	return (
		<div className={styles.container}>
			<CurrencyProvider ccyCode={price.currencyCode}>
				<div className={styles.inner}>
					<div>
						<ul className={styles.labels}>
							<li className={styles.label}>
								<Trans i18nKey="mobile.common.unitPriceLabel">
									<Price
										value={price.unitPrice}
										theme="accent"
										fallback="---"
									/>
								</Trans>
							</li>
							<li className={styles.label}>
								<Trans i18nKey="mobile.common.daysToShipLabel">
									<DaysToShip minDaysToShip={price.daysToShip} fallback="---" />
								</Trans>
							</li>
						</ul>
					</div>
					<div className={styles.quantityTotalPrice}>
						<label
							className={styles.label}
							htmlFor="actionsPanel-quantityField"
						>
							<Trans i18nKey="mobile.common.quantityLabel">
								<QuantityField
									id="actionsPanel-quantityField"
									value={price.quantity}
									min={partNumber.minQuantity}
									step={partNumber.orderUnit}
									onChangeByTrigger={check}
									onBlur={check}
									onPressEnter={check}
								/>
							</Trans>
						</label>
						{!priceNeedsQuote(price) && (
							<span className={styles.label}>
								<Trans i18nKey="mobile.common.totalPriceLabel">
									<Price
										value={price.totalPrice}
										theme="accent"
										className={styles.totalPrice}
									/>
								</Trans>
							</span>
						)}
					</div>
				</div>
			</CurrencyProvider>
			<div>
				<ul className={styles.actions}>
					<li>
						<Button theme="strong" icon="order-now" onClick={orderNow}>
							{t('mobile.common.orderNow')}
						</Button>
					</li>
					<li>
						<Button theme="conversion" icon="cart" onClick={addToCart}>
							{t('mobile.common.addToCart')}
						</Button>
					</li>
				</ul>
			</div>
			<Loader show={loading} />
		</div>
	);
};
ActionsPanel.displayName = 'ActionsPanel';

import classNames from 'classnames';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './PriceLeadTime.module.scss';
import { RecommendDaysToShip } from '@/components/mobile/domain/daysToShip';
import { Price } from '@/components/mobile/ui/text/Price';
import { config } from '@/config';
import { notNull } from '@/utils/predicate';

type Props = {
	campaignEndDate?: string;
	priceFrom?: number;
	deliveryFrom?: number;
	deliveryTo?: number;
};

/** PriceLeadTime component */
export const PriceLeadTime: React.VFC<Props> = ({
	campaignEndDate,
	priceFrom,
	deliveryFrom,
	deliveryTo,
}) => {
	const [t] = useTranslation();

	return (
		<>
			{notNull(priceFrom) && (
				<p className={styles.price}>
					<Trans i18nKey="mobile.pages.home.cameleerContents.priceLeadTime.from">
						<Price
							className={classNames({
								[String(styles.preDiscountPrice)]: !!campaignEndDate,
							})}
							value={priceFrom}
							ccyCode={config.defaultCurrencyCode}
							fallback="-"
						/>
					</Trans>
					{!!campaignEndDate && (
						<>
							<br />
							<span className={styles.campaignPriceLabel}>
								{t(
									'mobile.pages.home.cameleerContents.priceLeadTime.specialPrice'
								)}
							</span>
						</>
					)}
				</p>
			)}
			<RecommendDaysToShip
				minDaysToShip={deliveryFrom}
				maxDaysToShip={deliveryTo}
			/>
		</>
	);
};
PriceLeadTime.displayName = 'PriceLeadTime';

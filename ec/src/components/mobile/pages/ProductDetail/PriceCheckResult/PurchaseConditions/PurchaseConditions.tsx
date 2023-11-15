import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PurchaseConditions.module.scss';
import { TotalPrice } from './TotalPrice';
import { UnitPrice } from './UnitPrice';
import { NeedsQuoteMessage } from '@/components/mobile/pages/ProductDetail/PriceCheckResult/NeedsQuoteMessage';
import { OrderDeadline } from '@/components/mobile/ui/text/OrderDeadline';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { isPack } from '@/utils/domain/partNumber';
import {
	isDiscounted,
	needsQuote,
	priceNeedsQuote,
} from '@/utils/domain/price';

type Props = {
	price: Price | null;
	disableQuote: boolean;
	quote: () => void;
};

/**
 * PurchaseConditions Panel
 */
export const PurchaseConditions: React.VFC<Props> = ({
	price,
	disableQuote,
	quote,
}) => {
	const { t } = useTranslation();

	return (
		<div>
			{price?.orderDeadline && (
				<OrderDeadline
					className={styles.orderLimit}
					orderDeadline={price.orderDeadline}
				/>
			)}

			{/* Check price result */}
			<ul className={styles.checkResult}>
				{!priceNeedsQuote(price) && (
					<>
						<li className={styles.checkResultItem}>
							<dl className={styles.priceDetail}>
								<dt className={styles.priceLabel}>
									{t(
										'mobile.pages.productDetail.purchaseConditions.unitPriceLabel'
									)}
								</dt>
								<dd className={styles.priceValue}>
									<UnitPrice
										unitPrice={price?.unitPrice}
										standardUnitPrice={price?.standardUnitPrice}
									/>
									{price && isPack(price) && (
										<p>
											{t(
												'mobile.pages.productDetail.purchaseConditions.unitPricePiecePerPackage',
												{ piecesPerPackage: price.piecesPerPackage }
											)}
										</p>
									)}
								</dd>
							</dl>
						</li>
						<li className={styles.checkResultItem}>
							<dl className={styles.priceDetail}>
								<dt className={styles.priceLabel}>
									{t(
										'mobile.pages.productDetail.purchaseConditions.totalAmountLabel'
									)}
								</dt>
								<dd className={styles.priceValue}>
									<TotalPrice
										totalPrice={price?.totalPrice}
										discounted={isDiscounted(price)}
									/>
								</dd>
							</dl>
						</li>
					</>
				)}
				{price && needsQuote(price) && (
					<li className={styles.checkResultItem}>
						<NeedsQuoteMessage
							price={price}
							quote={quote}
							disableQuote={disableQuote}
						/>
					</li>
				)}
			</ul>
		</div>
	);
};
PurchaseConditions.displayName = 'PurchaseConditions';

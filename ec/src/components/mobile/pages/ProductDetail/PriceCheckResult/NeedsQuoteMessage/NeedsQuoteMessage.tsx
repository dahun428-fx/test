import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NeedsQuoteMessage.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { Flag } from '@/models/api/Flag';
import UnfitType from '@/models/api/constants/UnfitType';
import { Price as RawPrice } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { daysToShipNeedsQuote, priceNeedsQuote } from '@/utils/domain/price';

type Price = Pick<
	RawPrice,
	| 'unfitType'
	| 'largeOrderMaxQuantity'
	| 'daysToShipInquiryFlag'
	| 'priceInquiryFlag'
>;

type Props = {
	price: Price;
	quote: () => void;
	disableQuote: boolean;
	className?: string;
};

/**
 * Message needs Quote by Customer support
 */
export const NeedsQuoteMessage: React.VFC<Props> = ({
	price,
	quote,
	disableQuote,
	className,
}) => {
	const { t } = useTranslation();
	const { target, message } = getQuoteMessage(price, t);
	return (
		<dl className={className}>
			<dt className={styles.bold}>{target}</dt>
			<dd className={styles.message}>
				{message}

				<p className={styles.quoteOnWosWrap}>
					<Button
						theme="strong"
						icon="quote"
						onClick={quote}
						disabled={disableQuote}
					>
						{t('mobile.pages.productDetail.quoteOnWos')}
					</Button>
				</p>
			</dd>
		</dl>
	);
};
NeedsQuoteMessage.displayName = 'NeedsQuoteMessage';

/**
 * - Out of Specification Unfit / Big order / Needs inquiry Price and Lead time
 *   - Quote target: Price and Lead time
 * - Needs inquiry only Price
 *   - Quote target: Price
 * - Needs inquiry only Lead time
 *   - Quote target: Lead time
 */
function getQuoteMessage(price: Price, t: TFunction) {
	if (price.unfitType === UnfitType.NonstandardUnfit) {
		return {
			target: t('mobile.pages.productDetail.needsQuoteMessage.quoteTarget.all'),
			message: t('mobile.pages.productDetail.needsQuoteMessage.outOfSpecific'),
		};
	}

	if (price.largeOrderMaxQuantity) {
		return {
			target: t('mobile.pages.productDetail.needsQuoteMessage.quoteTarget.all'),
			message: t('mobile.pages.productDetail.needsQuoteMessage.bigOrder', {
				largeOrderMaxQuantity: price.largeOrderMaxQuantity,
			}),
		};
	}

	if (
		Flag.isTrue(price.priceInquiryFlag) &&
		Flag.isTrue(price.daysToShipInquiryFlag)
	) {
		return {
			target: t('mobile.pages.productDetail.needsQuoteMessage.quoteTarget.all'),
			message: t('mobile.pages.productDetail.needsQuoteMessage.priceLeadTime'),
		};
	}

	if (priceNeedsQuote(price)) {
		return {
			target: t(
				'mobile.pages.productDetail.needsQuoteMessage.quoteTarget.price'
			),
			message: t('mobile.pages.productDetail.needsQuoteMessage.price'),
		};
	}

	if (daysToShipNeedsQuote(price)) {
		return {
			target: t(
				'mobile.pages.productDetail.needsQuoteMessage.quoteTarget.daysToShip'
			),
			message: t('mobile.pages.productDetail.needsQuoteMessage.leadTime'),
		};
	}

	// Shouldn't reach here.
	return {
		target: t(
			'mobile.pages.productDetail.needsQuoteMessage.quoteTarget.daysToShip'
		),
	};
}

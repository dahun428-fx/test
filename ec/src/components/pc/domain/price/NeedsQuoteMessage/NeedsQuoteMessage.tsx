import classNames from 'classnames';
import { TFunction } from 'i18next';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './NeedsQuoteMessage.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Flag } from '@/models/api/Flag';
import UnfitType from '@/models/api/constants/UnfitType';
import { Price as RawPrice } from '@/models/api/msm/ect/price/CheckPriceResponse';
import {
	daysToShipNeedsQuote,
	needsQuote,
	priceNeedsQuote,
} from '@/utils/domain/price';
import { url } from '@/utils/url';

type Price = Pick<
	RawPrice,
	| 'unfitType'
	| 'largeOrderMaxQuantity'
	| 'daysToShipInquiryFlag'
	| 'priceInquiryFlag'
>;

type Props = {
	price?: Price;
	className?: string;
	isDisabled: boolean;
	isPurchaseLinkUser: boolean;
	quoteOnWOS: () => Promise<void>;
};

/**
 * Needs quote message
 */
export const NeedsQuoteMessage: React.VFC<Props> = ({
	price,
	className,
	isDisabled,
	isPurchaseLinkUser,
	quoteOnWOS,
}) => {
	const { t } = useTranslation();

	if (!price || !needsQuote(price) || isPurchaseLinkUser) {
		return null;
	}

	const { message } = getQuoteMessage(price, t);

	return (
		<div className={classNames(styles.container, className)}>
			<span>{message}</span>
			<div>
				<Button
					theme="default-sub"
					icon="wos-quote"
					className={styles.button}
					disabled={isDisabled}
					onClick={quoteOnWOS}
				>
					{t('components.domain.price.needsQuoteMessage.quoteOnWos')}
				</Button>
			</div>
		</div>
	);
};
NeedsQuoteMessage.displayName = 'NeedsQuoteMessage';

/** Return quote message */
function getQuoteMessage(price: Price, t: TFunction) {
	if (price.unfitType === UnfitType.NonstandardUnfit) {
		return {
			message: t('components.domain.price.needsQuoteMessage.nonstandard'),
		};
	}

	if (price.largeOrderMaxQuantity) {
		return {
			message: t('components.domain.price.needsQuoteMessage.bigOrder', {
				largeOrderMaxQuantity: price.largeOrderMaxQuantity,
			}),
		};
	}

	if (
		Flag.isTrue(price.priceInquiryFlag) &&
		Flag.isTrue(price.daysToShipInquiryFlag)
	) {
		return {
			message: t('components.domain.price.needsQuoteMessage.priceLeadTime'),
		};
	}

	if (priceNeedsQuote(price)) {
		return {
			message: (
				<Trans i18nKey="components.domain.price.needsQuoteMessage.price">
					<a href={url.wos.staticContents.helpPage('ko')}></a>
					<br></br>
				</Trans>
			),
			// message: t('components.domain.price.needsQuoteMessage.price'),
		};
	}

	if (daysToShipNeedsQuote(price)) {
		return {
			message: t('components.domain.price.needsQuoteMessage.leadTime'),
		};
	}

	// Shouldn't reach here.
	return {
		target: t('components.domain.price.needsQuoteMessage.nonstandard'),
	};
}

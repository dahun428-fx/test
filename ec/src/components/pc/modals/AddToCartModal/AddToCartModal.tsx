import classNames from 'classnames';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './AddToCartModal.module.scss';
import { AddToCartRecommend } from './AddToCartRecommend';
import { NeedsQuoteMessage } from '@/components/pc/domain/price/NeedsQuoteMessage';
import { PriceLeadTime } from '@/components/pc/domain/price/PriceLeadTime';
import { LinkButton } from '@/components/pc/ui/buttons';
import { CurrencyProvider } from '@/components/pc/ui/text/Price';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import legacyStyles from '@/styles/pc/legacy/modalRecommendations.module.scss';
import { notEmpty } from '@/utils/predicate';
import { url } from '@/utils/url';

export type Series = {
	seriesCode: string;
	brandCode: string;
	brandName: string;
};

type Props = {
	price: Price;
	series?: Series;
	currencyCode?: string;
	seriesCode: string;
	brandName?: string;
	cartCount: number;
	addedCount: number;
	hasQuotePermission: boolean;
	authenticated: boolean;
	isPurchaseLinkUser: boolean;
	isAbleToCheckout: boolean;
	close?: () => void;
	quoteOnWOS: (price: Price) => Promise<void>;
};

/**
 * Add To Cart complete modal
 */
export const AddToCartModal: React.VFC<Props> = ({
	price,
	currencyCode,
	seriesCode,
	series,
	brandName,
	cartCount,
	addedCount,
	hasQuotePermission,
	authenticated,
	isPurchaseLinkUser,
	isAbleToCheckout,
	quoteOnWOS,
}) => {
	const [t] = useTranslation();

	return (
		<CurrencyProvider ccyCode={currencyCode}>
			<div
				className={classNames(
					legacyStyles.modalRecommendations,
					styles.addToCartModal
				)}
			>
				<h2 className={styles.title}>
					{t('components.modals.addToCartModal.title', {
						addedCount,
					})}
				</h2>

				<div className={styles.productMain}>
					<div className={styles.productHead}>
						{brandName && <p className={styles.brandName}>{brandName}</p>}
						{price.productName && (
							<p
								className={styles.productName}
								dangerouslySetInnerHTML={{ __html: price.productName }}
							/>
						)}
						{price.partNumber && (
							<p className={styles.partNumber}>
								<span className={styles.partNumberLabel}>
									{t('components.modals.addToCartModal.partNumber')}
								</span>
								<span>{price.partNumber}</span>
							</p>
						)}
					</div>

					<div className={styles.priceLeadTime}>
						<PriceLeadTime
							price={price}
							isAbleToCheckout={isAbleToCheckout}
							prepend="quantity"
						/>
						{notEmpty(seriesCode) && series && (
							<NeedsQuoteMessage
								price={price}
								className={styles.quoteOnWos}
								isPurchaseLinkUser={isPurchaseLinkUser}
								isDisabled={authenticated && !hasQuotePermission}
								quoteOnWOS={() => quoteOnWOS(price)}
							/>
						)}
					</div>

					<div className={styles.action}>
						<Trans
							i18nKey="components.modals.addToCartModal.cartCount"
							values={{
								cartCount,
							}}
						>
							<span className={styles.cartCount}>{{ cartCount }}</span>
						</Trans>
						<LinkButton
							className={styles.viewCart}
							theme="conversion"
							size="m"
							href={url.myPage.cart}
						>
							{t('components.modals.addToCartModal.viewCart')}
						</LinkButton>
					</div>
				</div>
				{
					// TODO:
					// 	At this time, seriesCode may be an empty string,
					// 	so it's implemented this way, which needs to be modified.
					!!seriesCode && (
						<AddToCartRecommend
							seriesCode={seriesCode}
							className={styles.recommend}
						/>
					)
				}
			</div>
		</CurrencyProvider>
	);
};

AddToCartModal.displayName = 'AddToCartModal';

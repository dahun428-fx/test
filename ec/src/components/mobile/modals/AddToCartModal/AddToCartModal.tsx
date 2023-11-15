import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './AddToCartModal.module.scss';
import { Button, LinkButton } from '@/components/mobile/ui/buttons';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { DeprecatedDaysToShip } from '@/components/mobile/ui/text/DeprecatedDaysToShip';
import { PriceWithSale } from '@/components/mobile/ui/text/PriceWithSale';
import { TotalPrice } from '@/components/mobile/ui/text/TotalPrice';
import { Flag } from '@/models/api/Flag';
import { AddCartResponse } from '@/models/api/msm/ect/cart/AddCartResponse';
import { daysToShipNeedsQuote, priceNeedsQuote } from '@/utils/domain/price';
import { url } from '@/utils/url';

type Props = {
	addCartResponse: AddCartResponse;
	campaignApplyFlag?: Flag;
	isPurchaseLinkUser: boolean;
	close?: () => void;
};

/**
 * Add To Cart complete modal
 */
export const AddToCartModal: React.VFC<Props> = ({
	addCartResponse,
	campaignApplyFlag,
	isPurchaseLinkUser,
	close,
}) => {
	const { t } = useTranslation();

	const { cartItemList, cartCount, currencyCode } = addCartResponse;
	const cartItem = cartItemList[0] ?? null;

	if (!cartItem) {
		return null;
	}

	/** Price sale or not */
	const isSale = !!(
		cartItem &&
		cartItem.unitPrice &&
		cartItem.standardUnitPrice &&
		cartItem.unitPrice < cartItem.standardUnitPrice
	);

	return (
		<div className={styles.cartModal}>
			<div className={styles.productImage}>
				<ProductImage
					imageUrl={cartItem.productImageUrl}
					size={128}
					preset="t_product_main"
				/>
			</div>
			<div className={styles.productMain}>
				<p>{cartItem.partNumber}</p>
				<p
					className={styles.productName}
					dangerouslySetInnerHTML={{ __html: cartItem.productName ?? '' }}
				/>
				<p dangerouslySetInnerHTML={{ __html: cartItem.brandName ?? '' }} />

				<div className={styles.cartInfo}>
					<div className={styles.mainContent}>
						<ul className={styles.infoList}>
							<li className={styles.infoItem}>
								<dl className={styles.infoRow}>
									<dt className={styles.infoLabel}>
										{t('mobile.components.modals.addToCartModal.orderQuantity')}
									</dt>
									<dd className={styles.infoValue}>{cartItem.quantity}</dd>
								</dl>
							</li>

							{!priceNeedsQuote(cartItem) && (
								<>
									<li className={styles.infoItem}>
										<dl className={styles.infoRow}>
											<dt className={styles.infoLabel}>
												{t('mobile.components.modals.addToCartModal.unitPrice')}
											</dt>
											<dd className={styles.infoValue}>
												<PriceWithSale
													standardUnitPrice={cartItem.standardUnitPrice}
													unitPrice={cartItem.unitPrice}
													campaignApplyFlag={campaignApplyFlag}
													currencyCode={currencyCode}
												/>
											</dd>
										</dl>
									</li>
									<li className={styles.infoItem}>
										<dl className={styles.infoRow}>
											<dt className={styles.infoLabel}>
												{t('mobile.components.modals.addToCartModal.total')}
											</dt>
											<dd className={styles.infoValue}>
												<TotalPrice
													isSale={isSale}
													totalPrice={cartItem.totalPrice}
													currencyCode={currencyCode}
												/>
											</dd>
										</dl>
									</li>
								</>
							)}
							{!daysToShipNeedsQuote(cartItem) && (
								<li className={styles.infoItem}>
									<dl className={styles.infoRow}>
										<dt className={styles.infoLabel}>
											{t('mobile.components.modals.addToCartModal.shipDate')}
										</dt>
										<dd className={styles.infoValue}>
											<DeprecatedDaysToShip
												isPurchaseLinkUser={isPurchaseLinkUser}
												daysToShip={cartItem.daysToShip}
												theme="boldNumber"
											/>
										</dd>
									</dl>
								</li>
							)}
						</ul>
					</div>
					<div>
						<p className={styles.asideTitle}>
							<Trans i18nKey="mobile.components.modals.addToCartModal.cartCount">
								<span className={styles.highLightText}>{{ cartCount }}</span>
							</Trans>
						</p>

						<div className={styles.buttonWrapper}>
							<LinkButton
								icon="cart"
								theme="conversion"
								size="max"
								href={url.myPage.cart}
							>
								<span className={styles.buttonLabel}>
									{t('mobile.components.modals.addToCartModal.viewCart')}
								</span>
							</LinkButton>
						</div>

						<div className={styles.buttonWrapper}>
							<Button size="max" onClick={close}>
								<span className={styles.buttonLabel}>
									{isPurchaseLinkUser
										? t('mobile.components.modals.addToCartModal.close')
										: t(
												'mobile.components.modals.addToCartModal.continueShopping'
										  )}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

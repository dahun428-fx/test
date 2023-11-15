import classNames from 'classnames';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrderNoListedProductContent } from './OrderNoListedProductContent.hook';
import styles from './OrderNoListedProductModal.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { config } from '@/config';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';

type Props = {
	partNumber: PartNumber;
	close?: () => void;
};

/**
 * Order no listed product modal
 */
export const OrderNoListedProductContent: React.VFC<Props> = ({
	partNumber,
	close,
}) => {
	const { t } = useTranslation();
	const {
		isEcUser,
		authenticated,
		isPurchaseLinkUser,
		isCustomerTypeCheckout,
		hasCartPermission,
		hasOrderPermission,
		addToCart,
		orderNow,
		setInputQuantity,
	} = useOrderNoListedProductContent();

	const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
		setInputQuantity(event.target.value);
	};

	const handleAddToCart = useCallback(() => {
		close?.();
		addToCart(partNumber);
	}, [addToCart, close, partNumber]);

	const handleOrderNow = useCallback(() => {
		close?.();
		orderNow(partNumber);
	}, [close, orderNow, partNumber]);

	const orderNowButton = useMemo(() => {
		if (isPurchaseLinkUser || isCustomerTypeCheckout) {
			return null;
		}

		const isDisabled = !(!authenticated || isEcUser || hasOrderPermission);

		return (
			<li className={styles.orderButtonBox}>
				<Button
					theme="conversion"
					icon="order-now"
					size="max"
					onClick={handleOrderNow}
					disabled={isDisabled}
				>
					<span className={styles.orderButton}>
						{t('mobile.components.modals.orderNoListedProductModal.orderNow')}
					</span>
				</Button>
			</li>
		);
	}, [
		authenticated,
		handleOrderNow,
		hasOrderPermission,
		isCustomerTypeCheckout,
		isEcUser,
		isPurchaseLinkUser,
		t,
	]);

	const addToCartButton = useMemo(() => {
		const isDisabled = !(!authenticated || isEcUser || hasCartPermission);

		return (
			<li className={styles.cartButtonBox}>
				<Button
					theme="conversion"
					icon="cart"
					size="max"
					onClick={handleAddToCart}
					disabled={isDisabled}
				>
					<span className={styles.cartButton}>
						{t('mobile.components.modals.orderNoListedProductModal.addToCart')}
					</span>
				</Button>
			</li>
		);
	}, [authenticated, handleAddToCart, hasCartPermission, isEcUser, t]);

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.table}>
					<div className={styles.row}>
						<div
							className={classNames(
								styles.label,
								styles.cell,
								styles.textCenter
							)}
						>
							{t('mobile.components.modals.orderNoListedProductModal.brand')}:
						</div>
						<div className={styles.cell}>{partNumber.brandName}</div>
					</div>
					<div className={styles.row}>
						<div
							className={classNames(
								styles.label,
								styles.cell,
								styles.textCenter
							)}
						>
							{t(
								'mobile.components.modals.orderNoListedProductModal.partNumber'
							)}
							:
						</div>
						<div className={styles.cell}>{partNumber.partNumber}</div>
					</div>
					<div className={styles.row}>
						<div
							className={classNames(
								styles.label,
								styles.cell,
								styles.textCenter
							)}
						>
							{t('mobile.components.modals.orderNoListedProductModal.quantity')}
							:
						</div>
						<div className={styles.label}>
							<input
								maxLength={config.form.length.max.quantity}
								autoComplete="off"
								className={styles.quantityInput}
								onChange={handleChangeQuantity}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.buttonBox}>
				<ul className={styles.buttonList}>
					{orderNowButton}
					{addToCartButton}
				</ul>

				<div className={styles.closeButton}>
					<Button onClick={close}>
						<span className={styles.cancelButton}>
							{t('mobile.components.modals.orderNoListedProductModal.cancel')}
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

OrderNoListedProductContent.displayName = 'OrderNoListedProductContent';

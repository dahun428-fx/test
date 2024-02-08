import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import styles from './CartboxMessage.module.scss';
import { selectIsNetRicoh } from '@/store/modules/auth';
import { useSelector } from 'react-redux';
import { TFunction } from 'i18next';
import { Price } from '@/components/pc/ui/text/Price';
import { Trans, useTranslation } from 'react-i18next';
import { url } from '@/utils/url';

type Props = {
	cartItem: CartItem;
	currencyCode: string;
};

export const CartboxMessage: React.VFC<Props> = ({
	cartItem,
	currencyCode,
}) => {
	const [t] = useTranslation();

	const { message: orderDeadlineMessage } = getMessage(
		cartItem,
		currencyCode,
		t
	).orderDeadline();
	const { message: baraChargeMessage } = getMessage(
		cartItem,
		currencyCode,
		t
	).baraCharge();

	return (
		<div>
			{orderDeadlineMessage && (
				<div className={styles.error}>
					<div className={styles.errorText}>
						<p className={styles.info}>{orderDeadlineMessage}</p>
					</div>
				</div>
			)}
			{baraChargeMessage && (
				<div className={styles.error}>
					<div className={styles.errorText}>
						<p className={styles.info}>{baraChargeMessage}</p>
					</div>
				</div>
			)}
		</div>
	);
};

CartboxMessage.displayName = 'CartboxMessage';

function getMessage(cartItem: CartItem, currencyCode: string, t: TFunction) {
	const orderDeadline = () => {
		if (cartItem.orderDeadline) {
			return {
				message: t('components.domain.cartbox.cartboxMessage.orderDeadline', {
					orderDeadline: cartItem.orderDeadline,
				}),
			};
		} else {
			return { message: '' };
		}
	};

	const baraCharge = () => {
		if (cartItem.lowVolumeCharge) {
			const isNetRicoh = useSelector(selectIsNetRicoh);
			const text =
				cartItem.lowVolumeCharge.chargeType === '2'
					? t('components.domain.cartbox.cartboxMessage.chargeRaw1')
					: t('components.domain.cartbox.cartboxMessage.chargeRaw2');

			if (isNetRicoh) {
				return {
					message: (
						<Trans i18nKey="components.domain.cartbox.cartboxMessage.baraChargeNetRicoh">
							<span>{{ text }}</span>
							<Price
								value={cartItem.standardUnitPrice}
								ccyCode={currencyCode}
								theme="standard"
							/>
							<Price
								value={cartItem.lowVolumeCharge.charge}
								ccyCode={currencyCode}
								theme="standard"
							/>
						</Trans>
					),
				};
			}
			return {
				message: (
					<Trans i18nKey="components.domain.cartbox.cartboxMessage.baraCharge">
						<span>{{ text }}</span>
						<Price
							value={cartItem.standardUnitPrice}
							ccyCode={currencyCode}
							theme="standard"
						/>
						<a href={url.bara} target="guide"></a>
						<Price
							value={cartItem.lowVolumeCharge.charge}
							ccyCode={currencyCode}
							theme="standard"
						/>
					</Trans>
				),
			};
		} else {
			return { message: '' };
		}
	};
	return {
		orderDeadline,
		baraCharge,
	};
}

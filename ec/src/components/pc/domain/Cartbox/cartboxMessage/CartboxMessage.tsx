import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import styles from './CartboxMessage.module.scss';
import { selectIsNetRicoh } from '@/store/modules/auth';
import { useSelector } from 'react-redux';
import { TFunction } from 'i18next';
import { Price } from '@/components/pc/ui/text/Price';
import { Trans, useTranslation } from 'react-i18next';
import { url } from '@/utils/url';
import { notEmpty } from '@/utils/predicate';
import { MyComponentsItem } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';

type Props = {
	item: CartItem | MyComponentsItem;
	currencyCode: string;
};

export const CartboxMessage: React.VFC<Props> = ({ item, currencyCode }) => {
	const [t] = useTranslation();

	const { message: orderDeadlineMessage } = getMessage(
		item,
		currencyCode,
		t
	).orderDeadline();
	const { message: baraChargeMessage } = getMessage(
		item,
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

function getMessage(
	item: CartItem | MyComponentsItem,
	currencyCode: string,
	t: TFunction
) {
	const orderDeadline = () => {
		if (notEmpty(item.orderDeadline)) {
			return {
				message: t('components.domain.cartbox.cartboxMessage.orderDeadline', {
					orderDeadline: item.orderDeadline,
				}),
			};
		} else {
			return { message: '' };
		}
	};

	const baraCharge = () => {
		if (
			item.lowVolumeCharge &&
			Object.keys(item.lowVolumeCharge).length !== 0
		) {
			const isNetRicoh = useSelector(selectIsNetRicoh);
			const text =
				item.lowVolumeCharge.chargeType === '2'
					? t('components.domain.cartbox.cartboxMessage.chargeRaw1')
					: t('components.domain.cartbox.cartboxMessage.chargeRaw2');

			if (isNetRicoh) {
				return {
					message: (
						<Trans i18nKey="components.domain.cartbox.cartboxMessage.baraChargeNetRicoh">
							<span>{{ text }}</span>
							<Price
								value={item.standardUnitPrice}
								ccyCode={currencyCode}
								theme="standard"
							/>
							<Price
								value={item.lowVolumeCharge.charge}
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
							value={item.standardUnitPrice}
							ccyCode={currencyCode}
							theme="standard"
						/>
						<a href={url.bara} target="guide"></a>
						<Price
							value={item.lowVolumeCharge.charge}
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

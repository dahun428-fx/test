import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Photo.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { QuantityField } from '@/components/mobile/ui/fields';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	series: Series;
	addToCart: (payload: {
		brandCode: string;
		brandName: string;
		partNumber: string;
		quantity: number | null;
	}) => void;
	onClickOrderNow: (payload: {
		brandCode: string;
		brandName: string;
		partNumber: string;
		quantity: number | null;
	}) => void;
};

/** Product Item */
export const Photo: React.VFC<Props> = ({
	series,
	onClickOrderNow,
	addToCart,
}) => {
	const [t] = useTranslation();
	const [quantity, setQuantity] = useState<number | null>(null);

	return (
		<li className={styles.item} key={series.partNumber}>
			<div className={styles.image}>
				<ProductImage
					className={styles.image}
					comment={series.partNumber}
					size={120}
				/>
			</div>

			<div className={styles.information}>
				<p className={styles.label}>
					{t(
						'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.unlistedLabel'
					)}
				</p>
				<p className={styles.partNumber}>{series.partNumber}</p>
				<p className={styles.makerName}>{series.brandName}</p>
			</div>
			<p className={styles.proceed}>
				{t(
					'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.quotationOrderLabel'
				)}
			</p>
			<div className={styles.quantity}>
				<span className={styles.quantityLabel}>
					{t(
						'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.quantity'
					)}
				</span>
				<QuantityField
					value={quantity}
					onChange={setQuantity}
					className={styles.quantityInput}
				/>
			</div>
			<div>
				<Button
					theme="strong"
					icon="order-now"
					size="max"
					onClick={() =>
						onClickOrderNow({
							brandCode: series.brandCode,
							brandName: series.brandName,
							partNumber: series.partNumber,
							quantity,
						})
					}
					className={styles.orderNow}
				>
					{t('mobile.common.orderNow')}
				</Button>
				<Button
					theme="conversion"
					icon="cart"
					size="max"
					onClick={() =>
						addToCart({
							brandCode: series.brandCode,
							brandName: series.brandName,
							partNumber: series.partNumber,
							quantity,
						})
					}
				>
					{t('mobile.common.addToCart')}
				</Button>
			</div>
		</li>
	);
};

Photo.displayName = 'Photo';

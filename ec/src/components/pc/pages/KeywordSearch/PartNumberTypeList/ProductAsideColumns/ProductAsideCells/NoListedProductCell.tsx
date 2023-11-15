import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NoListedProductCell.module.scss';
import {
	useNoListedProductActions,
	useAuth,
} from '@/components/pc/pages/KeywordSearch/PartNumberTypeList/ProductAsideColumns/ProductAsideCells/NoListedProductCell.hooks';
import { Button } from '@/components/pc/ui/buttons';
import { QuantityField } from '@/components/pc/ui/fields';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	type: Series;
};

export const NoListedProductCell: React.VFC<Props> = ({ type }) => {
	const { t } = useTranslation();
	const [quantity, setQuantity] = useState<number | null>(null);

	const { addToCart, orderNow } = useNoListedProductActions(type);
	const { isPurchaseLinkUser } = useAuth();

	return (
		<td className={styles.dataCell} colSpan={2}>
			<div className={styles.form}>
				<label>
					<span className={styles.quantityLabel}>
						{t('pages.keywordSearch.partNumberTypeList.quantity')}
					</span>
					<QuantityField
						className={styles.quantityForm}
						value={quantity}
						onChange={setQuantity}
					/>
				</label>
				{!isPurchaseLinkUser && (
					<div className={styles.button}>
						<Button theme="conversion" onClick={() => orderNow(quantity)}>
							{t('pages.keywordSearch.partNumberTypeList.orderNow')}
						</Button>
					</div>
				)}
				<div className={styles.button}>
					<Button theme="conversion" onClick={() => addToCart(quantity)}>
						{t('pages.keywordSearch.partNumberTypeList.addToCart')}
					</Button>
				</div>
			</div>
		</td>
	);
};
NoListedProductCell.displayName = 'NoListedProductCell';

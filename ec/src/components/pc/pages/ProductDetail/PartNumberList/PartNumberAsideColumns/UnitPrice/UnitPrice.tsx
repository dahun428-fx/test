import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UnitPrice.module.scss';
import { Price } from '@/components/pc/ui/text/Price';
import { Flag } from '@/models/api/Flag';

type Props = {
	currencyCode?: string;
	discontinuedProductFlag?: Flag;
	campaignUnitPrice?: number;
	campaignEndDate?: string;
	standardUnitPrice?: number;
};

/** Unit price */
export const UnitPrice: React.VFC<Props> = ({
	discontinuedProductFlag,
	campaignEndDate,
	campaignUnitPrice,
	currencyCode,
	standardUnitPrice,
}) => {
	const [t] = useTranslation();

	if (Flag.isTrue(discontinuedProductFlag)) {
		return <span className={styles.void}>-</span>;
	}

	if (campaignUnitPrice || campaignEndDate) {
		return (
			<div className={styles.price}>
				<span className={styles.strike}>
					<Price value={standardUnitPrice} ccyCode={currencyCode} />
				</span>
				<span className={styles.salePrice}>
					{campaignUnitPrice ? (
						<Price
							value={campaignUnitPrice}
							ccyCode={currencyCode}
							theme="medium-accent"
							isRed
						/>
					) : (
						<span className={styles.specialPrice}>
							{t('pages.productDetail.partNumberList.unitPrice.specialPrice')}
						</span>
					)}
				</span>
			</div>
		);
	}

	return (
		<Price
			value={standardUnitPrice}
			ccyCode={currencyCode}
			emptySentenceClassName={styles.void}
			emptySentence="-"
			theme="medium-accent"
		/>
	);
};

UnitPrice.displayName = 'UnitPrice';

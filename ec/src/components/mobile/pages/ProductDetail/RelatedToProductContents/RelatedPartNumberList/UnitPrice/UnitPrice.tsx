import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UnitPrice.module.scss';
import { Price } from '@/components/mobile/ui/text/Price';

type Props = {
	standardUnitPrice?: number;
	campaignUnitPrice?: number;
	campaignEndDate?: string;
	currencyCode?: string;
};

/** Unit price */
export const UnitPrice: React.VFC<Props> = ({
	standardUnitPrice,
	campaignUnitPrice,
	campaignEndDate,
	currencyCode,
}) => {
	const { t } = useTranslation();

	if (campaignUnitPrice || campaignEndDate) {
		return (
			<>
				{/* TODO: this UnitPrice component is copied from PartNumber/UnitPrice 
				but change <span> to <p> to match the design, need to check if possible 
				to make themes in a single UnitPrice component. Also removed campaignApplyFlag prop  */}
				<p className={styles.strike}>
					<Price value={standardUnitPrice} ccyCode={currencyCode} />
				</p>
				{campaignUnitPrice ? (
					<Price
						value={campaignUnitPrice}
						ccyCode={currencyCode}
						className={styles.salePrice}
					/>
				) : (
					<p className={styles.salePrice}>
						{t(
							'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.unitPrice.specialPrice'
						)}
					</p>
				)}
			</>
		);
	}

	if (standardUnitPrice) {
		return <Price value={standardUnitPrice} ccyCode={currencyCode} />;
	}

	return <span>-</span>;
};

UnitPrice.displayName = 'UnitPrice';

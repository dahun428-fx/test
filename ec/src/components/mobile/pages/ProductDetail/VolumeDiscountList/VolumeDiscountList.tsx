import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VolumeDiscount.module.scss';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';
import { Price } from '@/components/mobile/ui/text/Price';
import { VolumeDiscount } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { url } from '@/utils/url';

type Props = {
	volumeDiscountList: VolumeDiscount[];
	theme?: 'standard' | 'simple';
	className?: string;
};

/** Volume discount list component */
export const VolumeDiscountList: React.VFC<Props> = ({
	volumeDiscountList,
	theme = 'standard',
	className,
}) => {
	const [t] = useTranslation();

	const getClassName = (className: string) => {
		return styles[
			`${theme}${className[0]?.toUpperCase()}${className.slice(1)}`
		];
	};

	return (
		<table
			className={classNames(getClassName('volumeDiscountList'), className)}
			summary="Volume Discount"
		>
			<thead>
				<tr>
					<th className={getClassName('headerCell')}>
						{t('mobile.pages.productDetail.quantity')}
						{theme == 'standard' && (
							<a href={url.slideDiscountGuide} target="guide">
								<span className={styles.question}>?</span>
							</a>
						)}
					</th>
					<th className={getClassName('headerCell')}>
						{t('mobile.pages.productDetail.standardUnitPrice')}
					</th>
					<th className={getClassName('headerCell')}>
						{t('mobile.pages.productDetail.daysToShip')}
					</th>
				</tr>
			</thead>
			<tbody>
				{volumeDiscountList?.map((discount, index) => (
					<tr key={index}>
						<td className={getClassName('valueCell')}>
							{discount.minQuantity || 1}
							{discount.minQuantity !== discount.maxQuantity &&
								` - ${discount.maxQuantity ?? ''}`}
						</td>
						<td className={getClassName('valueCell')}>
							<Price value={discount.unitPrice} fallback="---" />
						</td>
						<td className={getClassName('valueCell')}>
							<DaysToShip
								minDaysToShip={discount.daysToShip}
								className={styles.daysToShipFont}
								fallback="---"
							/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
VolumeDiscountList.displayName = 'VolumeDiscountList';

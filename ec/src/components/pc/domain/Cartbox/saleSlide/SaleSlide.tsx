import classNames from 'classnames';
import React from 'react';
import styles from './SaleSlide.module.scss';
import { url } from '@/utils/url';
import { VolumeDiscount } from '@/models/api/msm/ect/cart/AddCartResponse';
import { Price } from '@/components/pc/ui/text/Price';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
	isModal: boolean;
	volumeDiscountList: VolumeDiscount[];
	currencyCode: string;
};
const REQUIRED_QUOTE_DAYS = 99;
export const SaleSlide: React.VFC<Props> = ({
	isModal,
	volumeDiscountList,
	currencyCode,
}) => {
	if (
		!volumeDiscountList ||
		volumeDiscountList.length < 1 ||
		volumeDiscountList[0]?.daysToShip === REQUIRED_QUOTE_DAYS
	) {
		return null;
	}

	const [t] = useTranslation();

	return (
		<>
			<table
				className={classNames(isModal ? styles.table : '')}
				summary={t('components.domain.cartbox.saleSlide.quantityDiscount')}
			>
				{isModal && (
					<colgroup>
						<col width="34%" />
						<col width="33%" />
						<col width="33%" />
					</colgroup>
				)}

				<thead>
					<tr>
						<th className={styles.help}>
							{t('components.domain.cartbox.saleSlide.quantity')}
							<a href={url.slideDiscountGuide} target="guide">
								<span>?</span>
							</a>
						</th>
						<th>{t('components.domain.cartbox.saleSlide.standardPrice')}</th>
						<th>{t('components.domain.cartbox.saleSlide.daysToShip')}</th>
					</tr>
				</thead>
				<tbody>
					{volumeDiscountList.map((item, index) => {
						return (
							<tr key={index}>
								{item.minQuantity === item.maxQuantity ? (
									<td>{item.minQuantity === 0 ? 1 : item.minQuantity}</td>
								) : (
									<td>
										{item.minQuantity === 0 ? 1 : item.minQuantity}
										{`~`}
										{item.maxQuantity || ''}
									</td>
								)}
								<td>
									<Price
										value={item.unitPrice}
										ccyCode={currencyCode}
										theme="standard"
										emptySentence="-"
									/>
								</td>
								{item.daysToShip === 99 ? (
									<td>{t('components.domain.cartbox.saleSlide.quote')}</td>
								) : (
									<td>
										<DaysToShip minDaysToShip={item.daysToShip} />
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
			<p>{t('components.domain.cartbox.saleSlide.info')}</p>
		</>
	);
};

SaleSlide.displayName = 'SaleSlide';

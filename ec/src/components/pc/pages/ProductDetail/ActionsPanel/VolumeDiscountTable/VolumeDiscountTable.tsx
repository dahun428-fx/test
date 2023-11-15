import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VolumeDiscountTable.module.scss';
import { DaysToShip } from '@/components/pc/pages/ProductDetail/DaysToShip';
import { Price } from '@/components/pc/ui/text/Price';
import { VolumeDiscount as VolumeDiscountItem } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { url } from '@/utils/url';

export type Props = {
	volumeDiscountList?: VolumeDiscountItem[];
	currencyCode?: string;
	isPurchaseLinkUser: boolean;
};

/** 別途調整、都度見積が必要な場合の日数 */
const DAYS_TO_NEED_QUOTE = 99;

/**
 * Volume discount component
 */
export const VolumeDiscountTable: VFC<Props> = ({
	volumeDiscountList,
	currencyCode,
	isPurchaseLinkUser,
}) => {
	const [t] = useTranslation();

	if (
		(volumeDiscountList && volumeDiscountList.length <= 1) ||
		(volumeDiscountList?.length === 1 &&
			volumeDiscountList?.[0]?.daysToShip === DAYS_TO_NEED_QUOTE)
	) {
		return null;
	}

	const renderQuantity = (minQuantity?: number, maxQuantity?: number) => {
		if (minQuantity === maxQuantity) {
			return minQuantity === 0 ? 1 : minQuantity;
		}

		return `${minQuantity === 0 ? 1 : minQuantity} - ${maxQuantity || ''}`;
	};

	const handleOpenSlideDiscountGuide = () => {
		window.open(url.slideDiscountGuide, 'guide', 'width=990,height=800');
	};

	const renderStandardUnitPrice = (
		unitPrice?: number,
		currencyCode?: string
	) => {
		if (unitPrice === 0) {
			return '-';
		}
		return <Price value={unitPrice} ccyCode={currencyCode} />;
	};

	const renderDaysToShip = (daysToShip?: number) => {
		if (daysToShip === DAYS_TO_NEED_QUOTE) {
			return t('common.quote.quote');
		}

		return (
			<DaysToShip
				daysToShip={daysToShip}
				isPurchaseLinkUser={isPurchaseLinkUser}
			/>
		);
	};

	return (
		<div>
			<table className={styles.table}>
				<tbody>
					<tr>
						<th className={styles.tableCellHeader}>
							{t('pages.productDetail.quantity')}&nbsp;
							<div
								className={styles.buttonHelpIcon}
								onClick={handleOpenSlideDiscountGuide}
							>
								<span className={styles.helpIcon}>?</span>
							</div>
						</th>
						{volumeDiscountList?.map((volumeDiscount, index) => {
							return (
								<td
									key={`${volumeDiscount.daysToShip}-${index}`}
									className={styles.tableCell}
								>
									{renderQuantity(
										volumeDiscount.minQuantity,
										volumeDiscount.maxQuantity
									)}
								</td>
							);
						})}
					</tr>
					<tr>
						<th className={styles.tableCellHeader}>
							{t('pages.productDetail.standardUnitPrice')}
						</th>
						{volumeDiscountList?.map((volumeDiscount, index) => {
							return (
								<td
									key={`${volumeDiscount.daysToShip}-${index}`}
									className={styles.tableCell}
								>
									{renderStandardUnitPrice(
										volumeDiscount.unitPrice,
										currencyCode
									)}
								</td>
							);
						})}
					</tr>
					<tr className={styles.tableLastRow}>
						<th className={styles.tableCellHeader}>
							{t('pages.productDetail.daysToShip')}
						</th>
						{volumeDiscountList?.map((volumeDiscount, index) => {
							return (
								<td
									key={`${volumeDiscount.daysToShip}-${index}`}
									className={styles.tableCell}
								>
									{renderDaysToShip(volumeDiscount.daysToShip)}
								</td>
							);
						})}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

VolumeDiscountTable.displayName = 'VolumeDiscountTable';

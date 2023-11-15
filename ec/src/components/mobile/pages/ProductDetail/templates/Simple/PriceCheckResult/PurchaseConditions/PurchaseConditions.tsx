import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PurchaseConditions.module.scss';
import { NeedsQuoteMessage } from '@/components/mobile/pages/ProductDetail/PriceCheckResult/NeedsQuoteMessage';
import { UnitPrice } from '@/components/mobile/pages/ProductDetail/PriceCheckResult/PurchaseConditions/UnitPrice';
import { VolumeDiscountList } from '@/components/mobile/pages/ProductDetail/VolumeDiscountList';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';
import { OrderDeadline } from '@/components/mobile/ui/text/OrderDeadline';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { isPack } from '@/utils/domain/partNumber';
import {
	daysToShipNeedsQuote,
	needsQuote,
	priceNeedsQuote,
} from '@/utils/domain/price';

/** 別途調整、都度見積が必要な場合の日数 */
const DAYS_TO_NEED_QUOTE = 99;

type Props = {
	price: Price | null;
	series: Series;
	quote: () => void;
	disableQuote: boolean;
};

/** Purchase conditions component */
export const PurchaseConditions: React.VFC<Props> = ({
	price,
	series,
	disableQuote,
	quote,
}) => {
	const [t] = useTranslation();
	const [showsVolumeDiscountList, setShowsVolumeDiscountList] = useState(false);
	const ableToShowVolumeDiscountList = !(
		!price ||
		(price.volumeDiscountList && price.volumeDiscountList.length <= 1) ||
		(price.volumeDiscountList?.length === 1 &&
			price.volumeDiscountList[0]?.daysToShip === DAYS_TO_NEED_QUOTE)
	);

	// Toggles the visibility of the volume discount list.
	const toggleShowsVolumeDiscountList = () =>
		setShowsVolumeDiscountList(prev => !prev);

	return (
		<div className={styles.container}>
			{price?.orderDeadline && (
				<div className={styles.item}>
					<OrderDeadline
						className={styles.orderLimit}
						orderDeadline={price.orderDeadline}
					/>
				</div>
			)}

			{!priceNeedsQuote(price) && (
				<div className={styles.item}>
					<div className={styles.title}>
						<span>
							{t(
								'mobile.pages.productDetail.templates.simple.priceCheckResult.purchaseConditions.unitPriceOrSpecification'
							)}
						</span>
						{ableToShowVolumeDiscountList && ( // NOTE: 1件しかない場合、都度見積もりではない（現行を踏襲）
							<div
								className={styles.volumeDiscountButton}
								onClick={toggleShowsVolumeDiscountList}
							>
								{t(
									'mobile.pages.productDetail.templates.simple.priceCheckResult.purchaseConditions.volumeDiscount'
								)}
								<div
									className={classNames({
										[String(styles.arrowUp)]: showsVolumeDiscountList,
										[String(styles.arrowDown)]: !showsVolumeDiscountList,
									})}
								/>
							</div>
						)}
					</div>
					<div className={classNames(styles.value, styles.price)}>
						<UnitPrice
							unitPrice={price?.unitPrice}
							standardUnitPrice={price?.standardUnitPrice}
						/>
					</div>
					{price && isPack(price) && (
						<p>
							{t(
								'mobile.pages.productDetail.purchaseConditions.unitPricePiecePerPackage',
								{ piecesPerPackage: price.piecesPerPackage }
							)}
						</p>
					)}
				</div>
			)}

			{!daysToShipNeedsQuote(price) && (
				<div className={styles.item}>
					<div className={styles.title}>
						{t('mobile.pages.productDetail.daysToShip')}
					</div>
					<div className={styles.value}>
						<DaysToShip
							minDaysToShip={price?.daysToShip || series.minStandardDaysToShip}
							maxDaysToShip={price ? undefined : series.maxStandardDaysToShip}
							fallback="-"
						/>
					</div>
				</div>
			)}

			{price && needsQuote(price) && (
				<li className={styles.checkResultItem}>
					<NeedsQuoteMessage
						price={price}
						quote={quote}
						disableQuote={disableQuote}
					/>
				</li>
			)}

			{ableToShowVolumeDiscountList && showsVolumeDiscountList && (
				<div className={styles.volumeDiscountTable}>
					<VolumeDiscountList
						volumeDiscountList={price.volumeDiscountList ?? []}
					/>
				</div>
			)}
		</div>
	);
};
PurchaseConditions.displayName = 'PurchaseConditions';

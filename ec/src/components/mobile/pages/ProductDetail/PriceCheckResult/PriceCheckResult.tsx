import classNames from 'classnames';
import React from 'react';
import styles from './PriceCheckResult.module.scss';
import { PurchaseConditions } from './PurchaseConditions';
import { StorkList } from '@/components/mobile/pages/ProductDetail/StorkList';
import { VolumeDiscountList } from '@/components/mobile/pages/ProductDetail/VolumeDiscountList';
import { Loader } from '@/components/mobile/ui/loaders/Loader';
import { CurrencyProvider } from '@/components/mobile/ui/text/Price';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { daysToShipNeedsQuote } from '@/utils/domain/price';

type Props = {
	checking?: boolean;
	price: Price | null;
	disableQuote: boolean;
	quote: () => void;
	className?: string;
};

/** 別途調整、都度見積が必要な場合の日数 */
const DAYS_TO_NEED_QUOTE = 99;

export const PriceCheckResult: React.VFC<Props> = ({
	checking,
	price,
	quote,
	disableQuote,
	className,
}) => {
	return (
		<CurrencyProvider ccyCode={price?.currencyCode}>
			<div className={classNames(styles.container, className)}>
				<PurchaseConditions
					price={price}
					disableQuote={disableQuote}
					quote={quote}
				/>
				{!!price?.volumeDiscountList &&
					price.volumeDiscountList.length >= 1 &&
					(price.volumeDiscountList.length > 1 || // NOTE: リストの長さが2以上（現行を踏襲）
						price.volumeDiscountList[0]?.daysToShip !== DAYS_TO_NEED_QUOTE) && ( // NOTE: 1件しかない場合、都度見積もりではない（現行を踏襲）
						<VolumeDiscountList volumeDiscountList={price.volumeDiscountList} />
					)}
				{price?.expressList != null &&
					price.expressList.length > 0 &&
					!daysToShipNeedsQuote(price) && (
						<StorkList expressList={price.expressList} />
					)}
				<Loader show={checking} />
			</div>
		</CurrencyProvider>
	);
};
PriceCheckResult.displayName = 'PriceCheckResult';

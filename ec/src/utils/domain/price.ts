import { TFunction } from 'react-i18next';
import { Flag } from '@/models/api/Flag';
import UnfitType from '@/models/api/constants/UnfitType';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';

export function isDiscounted(
	price: Pick<Price, 'standardUnitPrice' | 'unitPrice'> | null | undefined
) {
	if (!price || price.standardUnitPrice == null || price.unitPrice == null) {
		return false;
	}
	return price.standardUnitPrice > price.unitPrice;
}

export function isPack(
	price: Pick<Price, 'piecesPerPackage' | 'content'> | null | undefined
) {
	if (!price || !price.piecesPerPackage || price.piecesPerPackage <= 1) {
		return false;
	}

	// NOTE: 商品の内容量がスペック項目にあれば、パック品ではないと判定
	if (price.content) {
		return false;
	}
	return true;
}

type QuotePrice = Pick<
	Price,
	| 'unfitType'
	| 'largeOrderMaxQuantity'
	| 'daysToShipInquiryFlag'
	| 'priceInquiryFlag'
>;

/**
 * Need to quote cased by days to ship
 * 出荷日について見積もりが必要
 */
export function daysToShipNeedsQuote(
	price: QuotePrice | null | undefined,
	isCustomerTypeCheckout?: boolean
) {
	if (isCustomerTypeCheckout) {
		return false;
	}

	return !!(
		price &&
		(price.unfitType === UnfitType.NonstandardUnfit ||
			!!price.largeOrderMaxQuantity ||
			price.daysToShipInquiryFlag === Flag.TRUE)
	);
}

/**
 * Need to quote cased by price
 * 価格について見積もりが必要
 */
export function priceNeedsQuote(
	price: QuotePrice | null | undefined,
	isCustomerTypeCheckout?: boolean
) {
	if (isCustomerTypeCheckout) {
		return false;
	}

	return !!(
		price &&
		(price.unfitType === UnfitType.NonstandardUnfit ||
			!!price.largeOrderMaxQuantity ||
			price.priceInquiryFlag === Flag.TRUE)
	);
}

/**
 * Need to quote caused by someone
 * 何らかが原因となって見積もりが必要
 */
export function needsQuote(
	price: QuotePrice | null | undefined,
	isCustomerTypeCheckout?: boolean
) {
	if (isCustomerTypeCheckout) {
		return false;
	}

	return !!(
		price &&
		(price.unfitType === UnfitType.NonstandardUnfit ||
			!!price.largeOrderMaxQuantity ||
			price.priceInquiryFlag === Flag.TRUE ||
			price.daysToShipInquiryFlag === Flag.TRUE)
	);
}

/**
 * 表示する納期を算出する
 * 購買連携ユーザーでUFの場合、仮納期を返す
 *
 * @param price 価格チェック
 * @param user ユーザー情報
 * @returns 出荷日
 */
export function getDaysToShip(price: Price, user: GetUserInfoResponse | null) {
	if (!user) {
		return price.daysToShip;
	}
	const purchase = user.purchase;
	if (purchase?.unfitCheckoutFlag === '1') {
		if (
			['2', '8'].includes(price.unfitType ?? '') &&
			price.unitPrice &&
			price.unitPrice > 0 &&
			(!price.daysToShip || price.daysToShip <= 0)
		) {
			return price.brandCode === 'MSM1'
				? purchase.largeOrderDaysToShipMisumi
				: purchase.largeOrderDaysToShipVona;
		}
	}
	return price.daysToShip;
}

/**
 * 購買連携ユーザーの場合、価格チェック結果を補正する
 * @param price 価格チェック
 * @param user ユーザー情報
 * @returns 出荷日
 */
export function correctPriceIfPurchaseLinkUser(
	price: Price,
	user: GetUserInfoResponse | null
): Price {
	if (user == null || user.purchase == null) {
		return price;
	}

	return {
		...price,
		daysToShip: getDaysToShip(price, user),
		...{
			...(Flag.isTrue(user.purchase.checkoutFlag) && {
				orderDeadline: undefined,
			}),
		},
	};
}

/**
 * Get Text Day To Ship
 * @param t {TFunction}
 * @param daysToShip
 * @returns
 */
export function getDaysToShipText(t: TFunction, daysToShip?: number) {
	if (daysToShip === undefined) {
		return '';
	}

	return daysToShip === 0
		? t('utils.domain.daysToShip.sameDay')
		: t('utils.domain.daysToShip.someDays', { days: daysToShip });
}

/**
 * Minimum order quantity
 * (considering order unit quantity)
 *
 * @param price
 * @returns
 * - min === unit -> min (or unit)
 * - min < unit -> unit
 * - min > unit -> min % unit === 0 ? min : (min + unit) - min % unit
 */
export function getMinOrderQuantity(
	price: Pick<Price, 'minQuantity' | 'orderUnit'>
) {
	const { minQuantity = 1, orderUnit = 1 } = price;

	if (minQuantity === orderUnit) {
		return minQuantity;
	}

	if (minQuantity < orderUnit) {
		return orderUnit;
	}

	if (minQuantity % orderUnit) {
		return minQuantity + orderUnit - (minQuantity % orderUnit);
	}

	return minQuantity;
}

/** cache key */
export type CacheKey = `${string}\t${number}`;

/** Get cache key */
export function getCacheKey(product: {
	partNumber: string;
	quantity?: number | null;
}): CacheKey {
	return `${product.partNumber}\t${product.quantity ?? 0}`;
}

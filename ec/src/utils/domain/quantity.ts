import { TFunction } from 'react-i18next';
import { AssertionError } from '@/errors/app/AssertionError';

type Product = {
	quantity: number | null;
	orderUnit?: number;
	minQuantity?: number;
	piecesPerPackage?: number;
};

// message を返すので validate と命名しています。(boolean を返すなら isValid~)
export function validateQuantity(product: Product, t: TFunction): string[] {
	const messageList: string[] = [];
	const { quantity, orderUnit, minQuantity, piecesPerPackage } = product;

	// null
	if (quantity === null) {
		messageList.push(t('utils.domain.quantity.isNullWarning'));
		return messageList;
	}

	// 1 以上の整数
	if (quantity <= 0 || quantity % 1 !== 0) {
		messageList.push(t('utils.domain.quantity.notIntegerWarning'));
	}

	// 最低発注数量
	// If Minimum Quantity equals Order Unit, skips validation of Minimum Quantity.
	if (minQuantity && minQuantity !== orderUnit && quantity < minQuantity) {
		if (piecesPerPackage) {
			messageList.push(
				t('utils.domain.quantity.minQuantityPackWarning', { minQuantity })
			);
		} else {
			messageList.push(
				t('utils.domain.quantity.minQuantityWarning', { minQuantity })
			);
		}
	}

	// 発注単位数量
	if (orderUnit && quantity % orderUnit !== 0) {
		if (piecesPerPackage) {
			messageList.push(
				t('utils.domain.quantity.orderUnitPackWarning', { orderUnit })
			);
		} else {
			messageList.push(
				t('utils.domain.quantity.orderUnitWarning', { orderUnit })
			);
		}
	}

	return messageList;
}

export function assertQuantity(
	quantity: number | null,
	product: Omit<Product, 'quantity'>,
	t: TFunction
): asserts quantity is number {
	const messages = validateQuantity({ ...product, quantity }, t);
	if (messages.length) {
		throw new AssertionError('quantity', messages);
	}
}

/**
 * Check valid integer and not equal 0 or not
 * @param value
 * @returns {boolean}
 */
export function isValidQuantityNumber(value: string) {
	return /^[0-9]+$/.test(value) && Number(value) !== 0;
}

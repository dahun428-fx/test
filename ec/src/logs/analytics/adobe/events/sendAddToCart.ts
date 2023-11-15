import { AddToCartPayload } from './types/AddToCartEvents';

export function sendAddToCart({
	categoryCodeList,
	brandCode,
	seriesCode,
	partNumberCount,
}: AddToCartPayload) {
	try {
		window.sc_f_products_cart_add?.(
			categoryCodeList[0] ?? '',
			categoryCodeList[1] ?? '',
			categoryCodeList[2] ?? '',
			categoryCodeList[3] ?? '',
			categoryCodeList[4] ?? '',
			categoryCodeList[5] ?? '',
			brandCode,
			seriesCode,
			partNumberCount
		);
	} catch {
		// Do nothing
	}
}

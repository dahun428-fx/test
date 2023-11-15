import { PartNumber } from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';

export function sendOrderNoListedProductModalView({
	partNumber,
	brandCode,
	brandName,
}: PartNumber) {
	try {
		window.sc_f_nonecatalog_view?.(partNumber, brandCode, brandName);
	} catch (e) {
		// Do nothing
	}
}

export function sendOrderNoListedProductEvent({
	partNumber,
	brandCode,
	brandName,
}: PartNumber) {
	try {
		window.sc_f_nonecatalog_ordernow?.(partNumber, brandCode, brandName);
	} catch (e) {
		// Do nothing
	}
}

export function sendAddNoListedProductToCartEvent({
	partNumber,
	brandCode,
	brandName,
}: PartNumber) {
	try {
		window.sc_f_nonecatalog_cartadd?.(partNumber, brandCode, brandName);
	} catch (e) {
		// Do nothing
	}
}

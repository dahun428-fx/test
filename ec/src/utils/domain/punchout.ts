import { TFunction } from 'react-i18next';
import { Flag } from '@/models/api/Flag';
import { Error, Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';

type Message = {
	type: 'error' | 'warn';
	message: string;
};

/**
 * Return the part number includes invalid characters or not.
 */
function includesInvalidCharacters(payload: {
	partNumber: string;
	invalidChars?: string[]; // use selectInvalidChars
}): boolean {
	return !!payload.invalidChars?.some(character =>
		payload.partNumber.includes(character)
	);
}

/**
 * Return the first matched error message by error code.
 */
function getOneMessage(errorCode: string, errorList?: Error[]) {
	const message = errorList?.find(
		error => error.errorCode === errorCode
	)?.errorMessage;
	return message;
}

/**
 * Validate the count of items to be checked out.
 */
export function validateCheckoutCount(payload: {
	t: TFunction;
	count: number;
	checkoutMaxCount?: number; // use selectCheckoutMaxCount
}): Message[] {
	const { t, count, checkoutMaxCount } = payload;
	const messageList: Message[] = [];
	if (
		checkoutMaxCount !== undefined &&
		checkoutMaxCount > 0 &&
		checkoutMaxCount < count
	) {
		messageList.push({
			type: 'error',
			message: t('utils.domain.punchout.exceedsMaxCheckoutCount'),
		});
	}
	return messageList;
}

/**
 * Validate "price" object and return error messages.
 */
export function validatePrice(payload: {
	t: TFunction;
	price: Price;
	isAbleToCheckout: boolean; // use selectIsAbleToCheckout
	invalidChars?: string[]; // use selectInvalidChars
}): Message[] {
	const { t, price, isAbleToCheckout, invalidChars } = payload;
	const { purchase, partNumber, errorList } = price;
	const messageList: Message[] = [];

	if (
		purchase &&
		(Flag.isTrue(purchase.invalidBrandCodeFlag) ||
			Flag.isTrue(purchase.invalidInnerCodeFlag) ||
			Flag.isTrue(purchase.invalidClassifyCodeFlag) ||
			Flag.isTrue(purchase.invalidUnitPriceFlag))
	) {
		const message: string =
			getOneMessage('API006417', errorList) ?? t('utils.domain.punchout.error');
		messageList.push({ type: 'error', message });

		// return here (according to ect-web-my)
		return messageList;
	}

	// return here if unable to checkout (according to ect-web-my)
	if (!isAbleToCheckout) {
		return [];
	}

	// API006417 の最初の1つだけエラーとして追加
	// Add only the first one of API006417 as error
	let message = getOneMessage('API006417', errorList);
	if (message) {
		messageList.push({ type: 'error', message });
	}

	if (includesInvalidCharacters({ partNumber, invalidChars })) {
		messageList.push({
			type: 'error',
			message: t('utils.domain.punchout.includesInvalidCharacter'),
		});
	}

	// API006416 の最初の1つだけ警告として追加
	// Add only the first one of API006416 as warning
	message = getOneMessage('API006416', errorList);
	if (message) {
		messageList.push({ type: 'warn', message });
	}

	return messageList;
}

/**
 * Validate "price" object to checkout and return no problem or not.
 */
export function isProductAbleToCheckout(payload: {
	user: GetUserInfoResponse | null;
	price: Price | null;
}): boolean {
	const { user, price } = payload;

	if (!user || !price) {
		return false;
	}

	const isAbleToCheckout = Flag.isTrue(user.purchase?.checkoutFlag);
	const isAbleToCheckoutWithUnfit = Flag.isTrue(
		user.purchase?.unfitCheckoutFlag
	);
	/** Exist Unfit, export prohibition(輸出禁止), or other errors */
	const existsUnfitOrErrors = price.errorList?.some(
		error => error.errorCode === 'API006417'
	);
	const existsOtherErrors = price.errorList?.some(
		error => error.errorCode === 'WOS032'
	);

	return (
		isAbleToCheckout &&
		price.unitPrice !== undefined &&
		price.unitPrice > 0 &&
		!includesInvalidCharacters({
			partNumber: price.partNumber,
			invalidChars: user.purchase?.invalidChars?.split(''),
		}) &&
		(!existsUnfitOrErrors || isAbleToCheckoutWithUnfit) &&
		!existsOtherErrors
	);
}

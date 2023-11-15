import Big from 'big.js';
import { digit } from '@/utils/number';

/**
 * price formatter
 * @param value - specified value
 * @param digits - The number of digits to appear after the decimal point
 * @returns formatted price
 */
export function format(value: number | string | undefined, digits: number) {
	if (value == null || value === '') {
		return '';
	}

	try {
		return digit(Big(value).toFixed(digits));
	} catch (error) {
		return value;
	}
}

import { notNull } from '@/utils/predicate';

const DECIMAL_POINT = '.';
const SEPARATOR = ',';

/**
 * Converted the specified value to comma-separated string of three digits each.
 * @param value - number or string in numeric format
 * @returns converted digit
 */
export function digit(value?: number | string) {
	// exclude null, undefined, empty string
	if (value == null || value === '') {
		return '';
	}

	const [integer, fraction, ...rest] = String(value).split(DECIMAL_POINT);

	// If value is invalid numeric format, give up to convert.
	if (rest.length) {
		return String(value);
	}

	return [
		integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${SEPARATOR}`),
		fraction,
	]
		.filter(notNull)
		.join(DECIMAL_POINT);
}

/**
 * 指定の範囲の連番配列を生成します。
 *
 * @param {number} start 開始位置
 * @param {number} end 終了位置（連番に含まれず）
 * @returns {number[]} 連番配列
 */
export function range(start: number, end: number): number[] {
	const numbers: number[] = [];
	for (let i = start; i < end; i++) {
		numbers.push(i);
	}
	return numbers;
}

import { assertStringOrNumeric } from '@/utils/assertions';

/** Divide a list into multiple chunks */
export function chunk<T>(arr: T[], chunkSize: number): T[][] {
	const result: T[][] = [];

	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		result.push(chunk);
	}

	return result;
}

/**
 * Creates an object composed of keys generated from the input array.
 * The corresponding value of each key is the last element responsible for generating the key
 */
export function keyBy<T extends object>(
	arr: T[],
	key: keyof T | ((item: T) => string)
): Record<string, T> {
	const result: Record<string, T> = {};
	for (const item of arr) {
		if (typeof key === 'function') {
			result[key(item)] = item;
		} else {
			result[`${item[key]}`] = item;
		}
	}
	return result;
}

/**
 * Check if an array is intersect (having common items) with another array
 */
export function isIntersect<T>(arr: T[], anotherArr: T[]) {
	const arrSet = new Set(arr);
	for (const item of anotherArr) {
		if (arrSet.has(item)) {
			return true;
		}
	}
	return false;
}

/**
 * Group array items by a key
 */
export function groupBy<T extends object>(
	arr: T[],
	key: keyof T
): Record<string, T[]> {
	const result: Record<string, T[]> = {};

	for (const item of arr) {
		if (!result[`${item[key]}`]) {
			result[`${item[key]}`] = [];
		}

		result[`${item[key]}`]?.push(item);
	}

	return result;
}

export function find<T>(arr: T[], key: keyof T, value: T[keyof T]) {
	return arr.find(item => item[key] === value);
}

export function uniq<T>(
	values: T[],
	keySelector?: (element: T) => string | number
) {
	if (keySelector == null) {
		assertStringOrNumeric(values[0]);
	}
	return Array.from(
		new Map(
			values.map(value => [keySelector ? keySelector(value) : value, value])
		).values()
	);
}

/** Get last item of array */
export function last<T>(array: T[]): T | undefined {
	return array[array.length - 1];
}

/** Get first item of array */
export function first<T>(array: T[] | undefined): T | undefined {
	return array?.[0];
}

/** Remove items appeared twice in array. Similar to lodash's xor */
export function xor<T>(array1: T[], array2: T[]): T[] {
	const array = [...array1, ...array2];
	return array.filter((item, index) => {
		array.splice(index, 1);
		const unique = !array.includes(item);
		array.splice(index, 0, item);
		return unique;
	});
}

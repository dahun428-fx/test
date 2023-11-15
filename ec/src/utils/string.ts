import { SnakeToCamel } from '@/utils/type';

/**
 * Converts a snake case string to a camel case.
 *
 * @param from - snake case string
 * @returns camel case string
 * @template T
 */
export function snakeToCamel<T extends string>(from: string): SnakeToCamel<T> {
	return from
		.split('_')
		.map((token, index) =>
			index > 0 ? token.charAt(0).toUpperCase() + token.slice(1) : token
		)
		.join('') as SnakeToCamel<T>;
}

export function padZero(value: number | string, maxLength: number) {
	return String(value).padStart(maxLength, '0');
}

/**
 * Remove HTML tags (with or without attributes) from string.
 * Similar to PHP's strip_tags but do not handle PHP tags.
 * Inspired by Twig.js: https://github.com/twigjs/twig.js/blob/071be04a7f0fa31ca313a3eebce1a275f6562308/demos/node_express/public/vendor/twig.js#L1891
 */
export function removeTags(input: string) {
	const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
	return input.replace(tags, '');
}

/**
 * Convert string to number or undefined (Router周りで使うことを想定)
 */
export function toNumeric(string: string | undefined) {
	if (!string || Number.isNaN(Number(string))) {
		return undefined;
	}
	return Number(string);
}

/** Add (`&#8203;`) after each comma in the value */
export function appendZeroWidthSpaceToCommas(value: string) {
	return value.replace(/,/g, ',&#8203;');
}

/* eslint-disable */

import { notNull } from './predecator';

export function debug(data: any, title?: string) {
	const contents = [title, JSON.stringify(data, undefined, `\t`)].filter(
		notNull
	);
	console.log(...contents);
}

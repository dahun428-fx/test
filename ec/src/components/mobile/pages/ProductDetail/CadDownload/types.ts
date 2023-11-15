const errorTypeList = [
	'part-number-incomplete-error',
	'unavailable-part-number-error',
	'no-support-browser-error',
	'unknown-server-error',
	'not-available-error',
] as const;
export type ErrorType = typeof errorTypeList[number];

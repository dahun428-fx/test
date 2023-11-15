const BaseFlag = {
	TRUE: '1',
	FALSE: '0',
} as const;
type Flag = typeof BaseFlag[keyof typeof BaseFlag];

function isTrue(flag?: Flag) {
	return flag === '1';
}

function toFlag(value?: string | number | boolean): Flag {
	return Boolean(value) ? '1' : '0';
}

function isFlag(value: unknown): value is Flag {
	return typeof value === 'string' && ['0', '1'].includes(value);
}

const Flag = {
	...BaseFlag,
	isTrue,
	isFalse: (flag?: Flag) => !isTrue(flag),
	toFlag,
	isFlag,
} as const;

/** フラグ */
export { Flag };

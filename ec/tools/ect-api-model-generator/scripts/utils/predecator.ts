/* eslint-disable */

export function notNull<T>(v: T | undefined | null): v is T {
	return v != null;
}

export function notEmpty<T>(v: T | undefined | null): v is T {
	return !!v;
}

import Cookies, { CookieAttributes } from 'js-cookie';
import { Cookie } from './constants';
import { config } from '@/config';
import { isObject } from '@/utils/object';

const domain = config.cookie.domain;

/**
 * cookie setter
 * @param cookie - cookie constants
 * @param value - cookie value
 * @param options - cookie options
 */
export function setCookie(
	cookie: Cookie,
	value: string | object | number,
	options?: Pick<CookieAttributes, 'expires'>
) {
	const cookieValue = isObject(value) ? JSON.stringify(value) : String(value);
	Cookies.set(cookie.name, cookieValue, {
		domain,
		...cookie.options,
		...options,
	});
}

/**
 * cookie getter
 * @param cookie - cookie constants
 * @returns cookie value
 */
export function getCookie(cookie: Cookie) {
	return Cookies.get(cookie.name);
}

/**
 * remove cookie
 * @param cookie - cookie constants
 */
export function removeCookie(cookie: Cookie) {
	Cookies.remove(cookie.name, { domain });
}

/**
 * cookie object getter
 * @param cookie - cookie constants
 * @returns cookie value
 */
export function getCookieObject<T extends object>(
	cookie: Cookie
): T | undefined {
	const target = getCookie(cookie);
	if (!target) {
		return undefined;
	}
	// TODO: 簡易なタイプガードする
	return JSON.parse(target);
}

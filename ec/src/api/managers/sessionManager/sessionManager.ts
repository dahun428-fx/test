import { parse, serialize } from 'cookie';
import dayjs from 'dayjs';
import type { Session, User } from './types';
import { config } from '@/config';
import type { ServerResponse } from '@/models/node/types';
import { Cookie, getCookie, removeCookie, setCookie } from '@/utils/cookie';

type InitPayload = {
	cookie?: string;
	response: ServerResponse;
};

/** Server side store */
type Store = {
	session: Session;
	user: User;
	response?: ServerResponse;
};

const COOKIE_PATH = '/';

const onBrowser = typeof window !== 'undefined';

let store: Store = {
	session: {},
	user: {},
};

export const sessionManager = {
	/**
	 * Return session
	 *
	 * - on browser: get cookies from saved on browser
	 * - on server: get cookies from stored on sessionManager
	 */
	get(): Session {
		if (onBrowser) {
			return {
				refreshTokenHash: getCookie(Cookie.REFRESH_TOKEN_HASH),
				accessTokenKey: getCookie(Cookie.ACCESS_TOKEN_KEY),
				accessTokenExpiration: getCookie(Cookie.ACCESS_TOKEN_EXPIRATION),
			};
		} else {
			return store.session;
		}
	},

	/**
	 * Set session
	 *
	 * - on browser: save cookies to browser
	 * - on server: set cookies to http response headers (Set-Cookie) and sessionManager's store
	 */
	set(session: Required<Session>): void {
		if (onBrowser) {
			// 2023/2/17 現在の ect-web-my によると、本当は
			// refresh API によって得られた refreshTokenHash を cookie に保存する必要はない。
			// login API によって得られた refreshTokenHash のみ cookie に保存する。
			setCookie(Cookie.REFRESH_TOKEN_HASH, session.refreshTokenHash);
			setCookie(Cookie.ACCESS_TOKEN_KEY, session.accessTokenKey);
			setCookie(Cookie.ACCESS_TOKEN_EXPIRATION, session.accessTokenExpiration);
		} else {
			store.session = { ...session };
			setCookieHeader(session);
		}
	},

	/**
	 * Clear
	 */
	clear(): void {
		if (onBrowser) {
			removeCookie(Cookie.REFRESH_TOKEN_HASH);
			removeCookie(Cookie.ACCESS_TOKEN_KEY);
			removeCookie(Cookie.ACCESS_TOKEN_EXPIRATION);
		} else {
			store.session = {};
			store.user = {};
			setClearCookieHeader();
		}
	},

	/**
	 * Initialize sessionManager's store
	 * - Only for server side
	 * - Please call it at first on getServerSideProps.
	 */
	init({ cookie, response }: InitPayload): void {
		// ブラウザ側で実行されていたら何もしない (error を throw すべきだろうか？)
		if (onBrowser) {
			return;
		}

		const session = cookie ? parse(cookie) : {};
		const refreshTokenHash = session[Cookie.REFRESH_TOKEN_HASH.name];
		const accessTokenKey = session[Cookie.ACCESS_TOKEN_KEY.name];
		const accessTokenExpiration = session[Cookie.ACCESS_TOKEN_EXPIRATION.name];
		const userCode = session[Cookie.CUSTOMER_CODE.name]; // not a bug

		// init なので store 自体丸ごと置き換え (多くの場合そんな必要ないけど)
		store = {
			session: {
				refreshTokenHash,
				accessTokenKey,
				accessTokenExpiration,
			},
			user: { userCode },
			response,
		};
	},

	/**
	 * Return user
	 * - Only for server side
	 */
	getUser() {
		return store.user;
	},
};

/**
 * Set 'Set-Cookie' response header
 * - Only for server side
 */
function setCookieHeader({
	accessTokenKey,
	accessTokenExpiration,
}: Required<Pick<Session, 'accessTokenKey' | 'accessTokenExpiration'>>) {
	if (!store.response || store.response.headersSent) {
		return;
	}

	const options = {
		domain: config.cookie.domain,
		path: COOKIE_PATH,
		expires: dayjs().add(365, 'days').toDate(),
	};

	// 2023/2/17 現在の ect-web-my によると、refresh token hash はログイン時に取得したものを永久に使い回しており、
	// refresh api によって取得した refresh token hash は誰も使っていない。ということでここでもセットしない。
	store.response.setHeader('Set-Cookie', [
		serialize(Cookie.ACCESS_TOKEN_KEY.name, accessTokenKey, options),
		serialize(
			Cookie.ACCESS_TOKEN_EXPIRATION.name,
			accessTokenExpiration,
			options
		),
	]);
}

/**
 * Set 'Set-Cookie' response header to clear cookies
 * - Only for server side
 */
function setClearCookieHeader() {
	if (!store.response || store.response.headersSent) {
		return;
	}

	const options = {
		domain: config.cookie.domain,
		path: COOKIE_PATH,
		expires: new Date(),
	};

	store.response.setHeader('Set-Cookie', [
		serialize(Cookie.REFRESH_TOKEN_HASH.name, '', options),
		serialize(Cookie.ACCESS_TOKEN_KEY.name, '', options),
		serialize(Cookie.ACCESS_TOKEN_EXPIRATION.name, '', options),
	]);
}

import dayjs from 'dayjs';
import { Dispatch } from 'redux';
import { actions } from './slice';
import { getUserInfo } from '@/api/services/getUserInfo';
import { login as loginService } from '@/api/services/login';
import { logout as logoutService } from '@/api/services/logout';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { LoginRequest } from '@/models/api/msm/ect/auth/LoginRequest';
import {
	Cookie,
	getCookie,
	getCookieObject,
	removeCookie,
	setCookie,
} from '@/utils/cookie';
import { getCustomerInfo } from '@/api/services/getCustomerInfo';

/**
 * login operation
 */
function login(dispatch: Dispatch) {
	return async (payload: LoginRequest) => {
		const {
			sessionId,
			userCode,
			customerCode = null,
			refreshTokenHash,
			createCookieUrlList,
		} = await loginService(payload);

		setCookie(Cookie.REFRESH_TOKEN_HASH, refreshTokenHash);
		setCookie(Cookie.ACCESS_TOKEN_KEY, sessionId);
		// NOTE: セッションの有効期限は1時間
		//       厳密には通信時間(遅延含む)なども踏まえるともう少し早めの時間だと思われるが、
		//       5分間のマージンをとってリフレッシュするので問題ない。
		setCookie(
			Cookie.ACCESS_TOKEN_EXPIRATION,
			Math.floor(dayjs().add(1, 'hour').valueOf() / 1000)
		);

		const user = await getUserInfo(sessionId);
		const customer = await getCustomerInfo(sessionId);

		setCookie(
			Cookie.VONAEC_ALREADY_MEMBER,
			{
				...getCookieObject(Cookie.VONAEC_ALREADY_MEMBER),
				member: 1,
			},
			{ expires: 365 }
		);

		if (user.userCode) {
			setCookie(Cookie.CUSTOMER_CODE, user.userCode);
			setCookie(Cookie.MSM_USER_CODE, user.userCode);
		}

		dispatch(actions.login({ userCode, customerCode, user, customer }));
		writeCookieUrl(createCookieUrlList);

		aa.events.sendLoggedIn({ userCode });
		ga.events.loggedIn({ userCode });
	};
}

/**
 * logout operation
 */
function logout(dispatch: Dispatch) {
	return async () => {
		const sessionId = getCookie(Cookie.ACCESS_TOKEN_KEY);
		if (sessionId) {
			await logoutService({ sessionId })
				.then(response => writeCookieUrl(response.deleteCookieUrlList))
				.catch(() => {
					// ログアウトエラーはユーザーへのフィードバックは不要。
				});
		}
		dispatch(actions.logout());
		setCookie(Cookie.CUSTOMER_CODE, '');
		removeCookie(Cookie.REFRESH_TOKEN_HASH);
		removeCookie(Cookie.ACCESS_TOKEN_KEY);
		removeCookie(Cookie.ACCESS_TOKEN_EXPIRATION);
	};
}

/**
 * Refresh auth module state based on
 * the session information stored in the cookie.
 * @param dispatch
 */
export function refreshAuth(dispatch: Dispatch) {
	return async () => {
		const sessionId = getCookie(Cookie.ACCESS_TOKEN_KEY);
		const refreshTokenHash = getCookie(Cookie.REFRESH_TOKEN_HASH);

		// If there is no cookie, treat as not logged in.
		if (!sessionId || !refreshTokenHash) {
			return logout(dispatch)();
		}

		try {
			const user = await getUserInfo(sessionId);
			const customer = await getCustomerInfo(sessionId);

			// valid session or logged in
			if (user.sessionStatus !== '1' && user.userCode) {
				dispatch(
					actions.restore({
						userCode: user.userCode,
						customerCode: user.customerCode ?? null,
						user,
						customer,
					})
				);
			} else {
				return logout(dispatch)();
			}
		} catch (error) {
			if (error instanceof MsmApiError && error.isBadRequest) {
				return logout(dispatch)();
			}
		}
	};
}

/**
 * cookie 発行URLリストを DOM に書き込みます。
 * 本来、store のような状態管理モジュールないで DOM を編集するのは禁忌ですが、
 * 新認証システムのセッション登録の仕組み上(クライアント側で img タグをDOM に書き込む)、
 * このロジックはモジュール内に閉じておくべきと判断しました。
 * また、ここではその編集対象の DOM は本質的には「セッション情報登録API」
 * のようなものなので、本モジュールから呼び出すこととします。
 */
function writeCookieUrl(cookieUrlList: string[]) {
	// cgiを呼び出す不可視のimgタグをbodyに追加することで他ドメインのcookieを操作する
	// NOTE: クラス名つけて前にappendしたエレメントを削除した方が良さそうだがect-webもしてないのでやらない
	for (const url of cookieUrlList) {
		const image = new Image(1, 1);
		image.src = url;
		image.style.position = 'absolute';
		image.style.top = '0px';
		image.style.left = '0px';
		image.hidden = true;
		// WARN: documentに直接書き込むようなコードは本来書くべきではありません
		document.body.appendChild(image);
	}
}

export { login, logout };

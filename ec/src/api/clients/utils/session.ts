import axios, { AxiosResponse } from 'axios';
import { createAxios } from '@/api/clients/utils/createAxios';
import { sessionManager } from '@/api/managers/sessionManager';
import { config } from '@/config';
import { TokenRefreshError } from '@/errors/api/TokenRefreshError';
import { RefreshTokenRequest } from '@/models/api/auth/token/RefreshTokenRequest';
import {
	RawRefreshTokenResponse,
	RefreshTokenResponse,
} from '@/models/api/auth/token/RefreshTokenResponse';
import { assertObject } from '@/utils/assertions';
import { isObject, propsToCamel } from '@/utils/object';
import { notNull } from '@/utils/predicate';
import { sleep } from '@/utils/timer';

type Session = {
	refreshTokenHash?: string;
	accessTokenKey?: string;
	accessTokenExpiration?: string;
};

/** リフレッシュタイミングを決めるセッション有効期限までの余裕 (秒単位) */
const MARGIN = 5 /* minutes */ * 60; /* seconds */

/**
 * リフレッシュ中フラグ
 * - NOTE: 多重リフレッシュ防止に利用
 */
let refreshing = false;

/**
 * セッションIDを Cookie から取得する
 *
 * 有効期限間近である場合には一度トークンをリフレッシュし、新しいセッションIDを取得して返却する
 * 新しく取得したセッションIDはセッションの有効期限と共に Cookie に保存される
 *
 * @returns sessionId
 */
export async function getSessionId() {
	const session: Session = sessionManager.get();

	if (approachingExpiration(session.accessTokenExpiration)) {
		return await refreshToken();
	}

	return session.accessTokenKey;
}

/**
 * セッション有効期限切れ間近か
 * 有効期限が設定されていない場合は、有効期限切れとみなす
 */
function approachingExpiration(expiration?: string) {
	return !expiration || Number(expiration) - MARGIN < Date.now() / 1000;
}

/**
 * セッションをリフレッシュし、新しいセッションIDを返却する
 *
 * 既にリフレッシュ中の場合はリフレッシュが完了するまで待った後、
 * Cookie からセッションIDを取得して返す
 */
async function refreshToken() {
	let session: Session | null = null;

	if (refreshing) {
		while (refreshing) {
			await sleep(50);
		}

		// このタイミングの session (cookie) 再取得は必須です。過去取得したものを使い回してはダメです。
		session = sessionManager.get();
		if (!approachingExpiration(session.accessTokenExpiration)) {
			return session.accessTokenKey;
		}
	}

	if (!session) {
		session = sessionManager.get();
	}

	if (session.refreshTokenHash) {
		refreshing = true;
		try {
			const response = await refresh(session.refreshTokenHash);
			sessionManager.set({
				refreshTokenHash: response.refreshTokenHash,
				accessTokenKey: response.accessTokenKey,
				accessTokenExpiration: String(response.expiresIn),
			});
			return response.accessTokenKey;
		} catch (error) {
			if (error instanceof TokenRefreshError && error.status === 400) {
				// 400 で失敗した時のみ、cookie を削除しログアウト状態にする。
				// - 400 は例えば「不正な refresh token (invalid_token)」
				//   「有効期限切れ refresh token (not_authorized)」などがあり、他にも
				//   「user_not_found」「invalid_request」などがある。
				// - しかし一方で例えばネットワークエラーの場合は削除すべきではない。
				//   (参考: axios のエラーバリエーション)
				//   https://github.com/axios/axios/blob/v0.x/lib/core/AxiosError.js#L57
				sessionManager.clear();

				// datadog に warning 送信
				// eslint-disable-next-line no-console
				console.warn(error, sessionManager.getUser());
			} else {
				// datadog に error 送信
				// eslint-disable-next-line no-console
				console.error(error, sessionManager.getUser());
			}
		} finally {
			refreshing = false;
		}
	}
}

/**
 * Refresh access token
 * - NOTE: 他から呼び出されたくないので、このファイル内に記述しています。
 *         通常、このような処理は src/api/services 以下に配置してください。
 *         他で真似しないでください。
 *
 * @param refreshTokenHash - refresh token hash
 * @returns refresh token response
 */
async function refresh(
	refreshTokenHash: string
): Promise<RefreshTokenResponse> {
	return $axios
		.post<RefreshTokenRequest, AxiosResponse<RawRefreshTokenResponse>>(
			'/api-auth-v1/auth/api/token/refresh',
			{ refreshTokenHash }
		)
		.then(response => propsToCamel(response.data));
}

const $axios = createAxios(
	{
		baseURL: config.api.auth.origin,
		timeout: 29000,
		/** Transform request model to string (application/x-www-form-urlencoded) */
		transformRequest(request: unknown): string {
			assertObject(request);
			return Object.entries(request)
				.map(([key, value]) => {
					if (value == null || isObject(value)) {
						return undefined;
					}
					return `${key}=${encodeURIComponent(value)}`;
				})
				.filter(notNull)
				.join('&');
		},
		handleError(error: unknown) {
			if (axios.isAxiosError(error)) {
				throw new TokenRefreshError(error);
			}
			throw error;
		},
	},
	{ shouldSendApiLog: true }
);

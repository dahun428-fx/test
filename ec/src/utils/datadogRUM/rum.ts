// utils/datadogRUM/ は utils/datadog/rum.ts にまとめたい。
import { datadogRum } from '@datadog/browser-rum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shouldSendRum = (error: unknown) =>
	error instanceof Error &&
	error.name !== 'MsmApiError' &&
	error.name !== 'AuthApiError' &&
	error.name !== 'SinusApiError' &&
	error.name !== 'CadenasApiError' &&
	error.name !== 'CameleerApiError';

/**
 * datadog セッションとuser codeを紐付ける
 * @param userCode
 */
export const setUser = (userCode?: string): void => {
	if (userCode) {
		datadogRum.setUser({
			id: userCode,
		});
	}
};

/**
 * datadog セッションとuser codeの紐付けを解除する
 */
export const removeUser = (): void => {
	datadogRum.removeUser();
};

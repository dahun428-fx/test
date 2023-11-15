//=========================================================
// Server side utils
//=========================================================
import { parse as parseCookie } from 'cookie';
import { sessionManager } from '@/api/managers/sessionManager';
import { config } from '@/config';
import { ApiError } from '@/errors/api/ApiError';

export const cookie = (payload: { cookie?: string }) => {
	const cookies = payload.cookie != null ? parseCookie(payload.cookie) : {};

	return {
		pageSize: !!Number(cookies.vonaItemSearchPerPage)
			? Number(cookies.vonaItemSearchPerPage)
			: config.pagination.series.size,
	};
};

export function log(page: string, path: string) {
	// User code を調査用に毎回出力する(SREチームとの協議にて)。文字列 format 変えたい。
	// eslint-disable-next-line no-console
	console.log(`[${page}][SSR]`, { path, ...sessionManager.getUser() });
}

export function logError(page: string, path: string, error: unknown) {
	// User code を調査用に毎回出力する(SREチームとの協議にて)。文字列 format 変えたい。
	// eslint-disable-next-line no-console
	console.error(`[${page}][SSR][API ERROR]`, {
		path,
		...sessionManager.getUser(),
		error: error instanceof ApiError ? error.toJSON : error,
	});
}

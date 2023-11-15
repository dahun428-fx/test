import { ApiErrorResponse } from '@/models/api/ApiErrorResponse';

/**
 * sinus api ファミリーのエラーレスポンス interface です。
 * sinus api ファミリーのエラーレスポンスはこれを継承して実装してください。
 */
export interface SinusApiErrorResponse extends ApiErrorResponse {
	status: string;
	errorCode?: string;
	message?: string;
}

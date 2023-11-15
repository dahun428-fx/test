import { ApiErrorResponse } from '@/models/api/ApiErrorResponse';

/**
 * msm-api ファミリーのエラーレスポンス interface です。
 * msm-api ファミリーのエラーレスポンスはこれを継承して実装してください。
 */
export interface MsmApiErrorResponse extends ApiErrorResponse {
	/** エラーリスト */
	errorList: Error[];
}

/**
 * msm-api ファミリーの API エラー情報です
 */
export interface Error {
	/** エラーコード */
	errorCode?: string;

	/** エラーメッセージ */
	errorMessage?: string;

	/** フィールドリスト */
	fieldList?: string[];

	/** エラーパラメータリスト */
	errorParameterList?: unknown[];
}

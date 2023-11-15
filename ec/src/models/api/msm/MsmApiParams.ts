import { ApiParams } from '@/models/api/ApiParams';

/**
 * msm-api ファミリーの共通GETパラメータです。
 */
export interface MsmApiParams extends ApiParams {
	/** 言語コード */
	lang?: string;

	/** セッションID */
	sessionId?: string;

	/** アプリケーションID */
	applicationId?: string;

	/** 返却項目 */
	field?: string;

	/** デバッグ */
	debug?: string;

	/** レスポンスコード抑止 */
	suppressResponseCode?: string;
}

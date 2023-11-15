import { ApiResponse } from '@/models/api/ApiResponse';

/**
 * Cameleer API のレスポンス interface です。
 * Cameleer API のレスポンス interface はすべてこの
 * interface を継承して実装してください。
 */
export interface CameleerApiResponse extends ApiResponse {
	/** cameleerId (ApiId) */
	cameleerId: string;
	/** レコメンドタイトル */
	title: string;
	/** cookieId */
	cookieId: string;
	/** user code */
	userCd: string;
	/** ページID */
	dispPage: string;
	/** 表示パターンキー */
	dispPattern?: string;
	/** レコメンドコード */
	recoCd: string;
}

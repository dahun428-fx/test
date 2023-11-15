import { ApiRequest } from '@/models/api/ApiRequest';

/**
 * Cameleer APIのリクエストインターフェイスです。
 * Cameleer APIのリクエストはすべてこのインターフェイスを実装してください。
 */
export interface CameleerApiRequest extends ApiRequest {
	/** 現法コード */
	subsidiary: string;
	/** ページID, Gレコメンドオプション項目に変わる */
	dispPage?: string;
	/** 表示パターンキー */
	dispPattern?: string;
}

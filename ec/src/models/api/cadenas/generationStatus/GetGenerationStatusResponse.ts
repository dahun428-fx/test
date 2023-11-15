import { CadenasApiResponse } from '@/models/api/cadenas/CadenasApiResponse';

/**
 * CADENAS CAD 生成ステータス取得レスポンス
 */
export interface GetGenerationStatusResponse extends CadenasApiResponse {
	/** 有効期限を超過しているか */
	expired: boolean;
	/** CAD file URL */
	url: string;
	/** File name (not used) */
	file: string;
	/** Part number? (not used) */
	nb: string;
}

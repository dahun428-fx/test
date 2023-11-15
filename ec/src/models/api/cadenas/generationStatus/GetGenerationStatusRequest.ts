import { CadenasApiRequest } from '@/models/api/cadenas/CadenasApiRequest';

/**
 * CADENAS CAD 生成ステータス取得リクエスト
 */
export interface GetGenerationStatusRequest extends CadenasApiRequest {
	/** URL of download.xml */
	url: string;
}

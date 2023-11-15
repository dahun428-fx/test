import { SinusApiResponse } from '@/models/api/sinus/SinusApiResponse';

/** SINUS 3Dプレビューデータ取得API レスポンス */
export interface PreviewCadResponse extends SinusApiResponse {
	status: string;
	path?: string;
	errorCode?: string;
	message?: string;
}

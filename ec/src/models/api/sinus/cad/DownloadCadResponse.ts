import { SinusApiResponse } from '@/models/api/sinus/SinusApiResponse';

/** SINUS CAD ダウンロード API レスポンス */
export interface DownloadCadResponse extends SinusApiResponse {
	status: string;
	path?: string;
	errorCode?: string;
	message?: string;
}

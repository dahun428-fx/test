import { SinusApiRequest } from '@/models/api/sinus/SinusApiRequest';

/** SINUS CAD ダウンロード API リクエスト */
export interface DownloadCadRequest extends SinusApiRequest {
	partNumberList: PartNumber[];
}

export interface PartNumber {
	customer_cd?: string;
	language?: string;
	partNumber: string;
	seriesCode: string;
	brdCode: string;
	typeCode: string;
	SYCD: string;
	domain: string;
	environment: string;
	dl_format: string;
	specValueList?: Spec[];
	alterationSpecList?: Spec[];
}

export interface Spec {
	specCADCode?: string;
	specCADValue?: string;
}

/**
 * 3D CAD preview URL query
 */
export type Query = {
	brandCode: string;
	seriesCode: string;
	partNumber: string;
	/** 複数の場合はカンマ区切り / Comma separated if more than one */
	cadId?: string;
	completeFlag: string;
	cadDownloadButtonType: string;
	moldExpressType?: string;
	brandName: string;
	seriesName: string;
	seriesImage?: string;
};

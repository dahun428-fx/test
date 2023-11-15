import { CloudinaryApiResponse } from '@/models/api/cloudinary/CloudinaryApiResponse';

/** Get image size hosted on Cloudinary response */
export interface GetImageSizeResponse extends CloudinaryApiResponse {
	// input は使わせないので省略
	// input: {},

	/**
	 * Image info
	 * - 指定 preset で画像変換し出力された画像のサイズ情報
	 */
	output: {
		width: number;
		height: number;
		// bytes や format は使わせないので省略
	};
}

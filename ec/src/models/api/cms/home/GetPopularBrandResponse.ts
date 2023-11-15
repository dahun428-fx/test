import { ApiResponse } from '@/models/api/ApiResponse';

/**
 * 人気ブランド取得レスポンス
 */
export interface GetPopularBrandResponse extends ApiResponse {
	/** 人気ブランドリスト */
	brandList: popularBrand[];
}

export interface popularBrand {
	/** メーカー名 */
	brandName: string;
	/** メーカーリンク先URL */
	brandUrl: string;
	/** 画像URL */
	logoImageUrl: string;
}

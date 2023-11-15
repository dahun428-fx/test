import { ApiResponse } from '@/models/api/ApiResponse';
import { Flag } from '@/models/api/Flag';

/**
 * トップバナー取得レスポンス
 */
export interface GetTopBannerResponse extends ApiResponse {
	/** トップバナーリスト */
	bannerList: Banner[];
}

export interface Banner {
	/** 画像URL */
	imageUrl: string;
	/** バナーリンク先 */
	url: string;
	/** 別タブで開くか */
	targetBlankFlag: Flag;
}

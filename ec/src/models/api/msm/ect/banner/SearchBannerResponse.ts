import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** バナー情報取得APIレスポンス */
export interface SearchBannerResponse extends MsmApiResponse {
	/**
	 * バナーリスト
	 * - バナー情報のリスト
	 */
	bannerList?: Banner[];
}

/** バナー */
export interface Banner {
	/**
	 * バナー種別
	 * - バナー種別
	 *   1: Sバナー
	 *   2: Lバナー
	 */
	bannerType?: string;
	/**
	 * バナーパス
	 * - インクルードするバナーファイルのパス
	 */
	bannerPath?: string;
}

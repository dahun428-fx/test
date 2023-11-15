import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** キーワードバナー取得APIレスポンス */
export interface GetKeywordBannerResponse extends MsmApiResponse {
	/**
	 * バナーパス
	 * - キーワードに該当するバナーのパス
	 */
	bannerPath?: string;
}

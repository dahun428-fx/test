import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** バナー情報取得APIリクエスト */
export interface SearchBannerRequest extends MsmApiRequest {
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - NOTE: バナー情報マスタ.コードタイプ
	 *         → リクエストされたコードにより指定。
	 *         1: ブランドコード
	 *         2: カテゴリコード
	 *         3: シリーズコード
	 *         バナー情報マスタ.コード
	 *         → ブランドコード、カテゴリコード、シリーズコードのいずれかを指定。
	 */
	brandCode?: string;
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 */
	categoryCode?: string;
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - minLength: 12
	 * - maxLength: 12
	 */
	seriesCode?: string;
	/**
	 * バナー種別
	 * - バナー種別
	 *   1: Sバナー
	 *   2: Lバナー
	 * - minLength: 1
	 * - maxLength: 1
	 */
	bannerType?: string;
}

import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** 関連カテゴリ検索APIリクエスト */
export interface RelatedSearchCategoryRequest extends MsmApiRequest {
	/**
	 * カテゴリコード
	 * - 取得対象のカテゴリコード
	 * - example: M0101000000
	 */
	categoryCode: string;
	/**
	 * ブランドコード
	 * - プランドコードもしくはブランドURLコード
	 * - example: misumi
	 */
	brandCode?: string;
}

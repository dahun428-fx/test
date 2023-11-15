import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** このカテゴリにはこんな商品もあります取得APIレスポンス */
export interface SearchCategoryRecommendResponse extends MsmApiResponse {
	/**
	 * このカテゴリにはこんな商品もあります情報リスト
	 */
	categoryRecommendList: CategoryRecommend[];
}

/** このカテゴリにはこんな商品もあります情報 */
export interface CategoryRecommend {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - maxLength: 12
	 * - example: 110302634310
	 */
	seriesCode: string;
	/**
	 * シリーズ名
	 * - シリーズの名称
	 * - example: シャフト　ストレートタイプ
	 */
	seriesName: string;
}

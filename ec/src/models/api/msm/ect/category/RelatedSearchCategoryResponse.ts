import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 関連カテゴリ検索APIレスポンス */
export interface RelatedSearchCategoryResponse extends MsmApiResponse {
	/**
	 * カテゴリ情報リスト(親)
	 * - ヒットした親カテゴリ情報のリスト
	 * - NOTE: 上位カテゴリから下位カテゴリにソートされた状態で返却
	 */
	parentCategoryList?: ParentCategory[];
	/**
	 * カテゴリ情報リスト(兄弟)
	 * - ヒットした兄弟カテゴリ情報のリスト
	 */
	siblingCategoryList?: SiblingCategory[];
	/**
	 * カテゴリ情報リスト(子)
	 * - ヒットした子カテゴリ情報のリスト
	 * - NOTE: 表示順でソートされた状態で返却
	 */
	childCategoryList?: ChildCategory[];
}

/** カテゴリ情報(親) */
export interface ParentCategory {
	/**
	 * カテゴリコード（親）
	 * - カテゴリコード
	 * - maxLength: 11
	 * - example: mech
	 */
	categoryCode?: string;
	/**
	 * カテゴリ名（親）
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 */
	categoryName?: string;
	/**
	 * カテゴリURL(親)
	 * - カテゴリのURL
	 * - example: xxxxxxxx
	 */
	parentCategoryUrl?: string;
}

/** カテゴリ情報(兄弟) */
export interface SiblingCategory {
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - maxLength: 11
	 * - example: M0101000000
	 * - NOTE: 表示順でソートされた状態で返却
	 */
	categoryCode?: string;
	/**
	 * カテゴリ名
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 */
	categoryName?: string;
	/**
	 * カテゴリURL
	 * - カテゴリのURL
	 * - example: xxxxxxxx
	 */
	categoryUrl?: string;
}

/** カテゴリ情報(子) */
export interface ChildCategory {
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - maxLength: 11
	 * - example: M0101000000
	 */
	categoryCode?: string;
	/**
	 * カテゴリ名
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 */
	categoryName?: string;
	/**
	 * カテゴリURL
	 * - カテゴリのURL
	 * - example: xxxxxxxx
	 */
	categoryUrl?: string;
}

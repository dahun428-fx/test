/**
 * 表示するパネル
 * - loading: ローディング表示
 * - orderStatus: 注文ステータスパネル
 * - category: 最近見たカテゴリ
 * - about: About MISUMI コンテンツ
 */
export type PanelType = 'loading' | 'orderStatus' | 'category' | 'about';

export type MiniBanners = {
	html: string;
	purchaseLinkHtml: string;
};

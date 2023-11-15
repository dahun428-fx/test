/** Item list name (商品一覧リスト名) */
export const ItemListName = {
	/**
	 * Part number information
	 * - Product Detail page (商品詳細ページ)
	 * - Related part number list (Products like this... / この商品のバリエーション)
	 */
	PRODUCT_DETAIL: 'PageDetail',
	/**
	 * - Interest recommend (この商品を見た人は、こんな商品も見ています)
	 * - (検索結果の商品を見た人は、こんな商品も見ています)
	 * - (最近見た商品からのおすすめ商品)
	 */
	INTEREST_RECOMMEND: 'RecoCustomersViewed',
	/** (よく一緒に購入される商品) */
	PURCHASE_RECOMMEND: 'RecoCustomersPurchased',
	/** (このカテゴリにはこんな商品があります！) */
	CATEGORY_RECOMMEND: 'RecoAdditionalProducts',
	/**
	 * (型番ショートカット)
	 * (未掲載品注文モーダル)
	 */
	SUGGEST_PREVIEW: 'SuggestPreview',
	/** (価格・出荷日確認) */
	CHECK_PRICE: 'PageGear',
	/** (CADダウンロード履歴) */
	CAD_DL_HISTORY: 'CADDownloadHistory',
	/** (キーワード検索結果) */
	KEYWORD_SEARCH_RESULT: 'PageSearchResult',
	/** 過去に購入した商品から選ぶ */
	PURCHASE_SERIES_REPEAT_RECOMMEND: 'HistoryPurchasedProducts',
	/** 最近見た商品 */
	VIEW_HISTORY: 'HistoryViewedProducts',
	/** Category page */
	PAGE_CATEGORY: 'PageCategory',
} as const;

export type ItemListName = typeof ItemListName[keyof typeof ItemListName];

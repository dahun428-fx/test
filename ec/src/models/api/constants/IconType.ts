/**
 * アイコンタイプ
 */
export const IconType = {
	/** 新商品 */
	NEW_PRODUCT: '1',
	/** 脱脂洗浄 */
	WASHED: '2',
	/** 規格拡大 */
	STANDARD_ENLARGE: '3',
	/** 規格変更 */
	STANDARD_CHANGE: '4',
	/** 価格改定 */
	PRICE_CHANGE: '5',
	/** 値下げ */
	PRICE_DOWN: '6',
	/** 納期短縮 */
	SHORT_DELIVERY: '7',
	/** 規格拡張対象 */
	STANDARD_TARGET: '8',
	/** 数量スライド割引 */
	VOLUME_DISCOUNT: '1000',
	/** 定期便対象 */
	REGULAR_SERVICE: '1001',
	/** サンプル品対象 */
	SAMPLE: '1002',
	/** SDS(MSDS) */
	MSDS: '1003',
	/** 関連商品あり */
	RELATED_PRODUCT: '1004',
} as const;
export type IconType = typeof IconType[keyof typeof IconType];

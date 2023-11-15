/** シリーズ状態 */
const SeriesStatus = {
	/** 通常型番 */
	NORMAL: '1',
	/** 商品情報未掲載 */
	UNLISTED: '2',
	/** 規格廃止品 */
	DISCONTINUED: '3',
} as const;
type SeriesStatus = typeof SeriesStatus[keyof typeof SeriesStatus];
export { SeriesStatus };

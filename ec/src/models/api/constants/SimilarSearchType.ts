/** Similar search type */
const SimilarSearchType = {
	/** 使用する(デフォルトチェックあり) */
	USE_CHECKIN: '1',
	/** 使用する(デフォルトチェックなし) */
	USE_CHECKOUT: '2',
	/** 使用しない */
	NO_USE: '3',
} as const;

type SimilarSearchType =
	typeof SimilarSearchType[keyof typeof SimilarSearchType];
export default SimilarSearchType;

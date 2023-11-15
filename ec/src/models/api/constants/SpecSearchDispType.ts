/** スペック検索表示タイプ */
export const SpecSearchDispType = {
	/** 1: 一覧表示 */
	LIST: '1',
	/** 2: 写真表示 */
	PHOTO: '2',
	/** 3: 仕様比較表示 */
	COMPARE: '3',
} as const;
export type SpecSearchDispType =
	typeof SpecSearchDispType[keyof typeof SpecSearchDispType];

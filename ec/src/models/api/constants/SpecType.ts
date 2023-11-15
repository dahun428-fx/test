/** スペック項目タイプ */
export const SpecType = {
	/** C項目 */
	C: '1',
	/** D項目 */
	D: '2',
	/** E項目 */
	E: '3',
	/** E999項目（内容量スペック） */
	E999: '4',
} as const;
export type SpecType = typeof SpecType[keyof typeof SpecType];

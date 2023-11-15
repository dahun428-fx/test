/** Spec log message */
export interface SpecLogMessage {
	/** Parameter name */
	parameterName?: string;
	/** Parameter value */
	parameterValue?: string;
	/** 選択状態 */
	select: 'ON' | 'OFF';
	/**
	 * シリーズコード
	 * - categoryCode と言う名前だが騙されてはいけない。
	 *   ここにはシリーズコードをセットするのだ！
	 */
	categoryCode: string;
}

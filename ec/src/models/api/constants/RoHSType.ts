const RoHSType = {
	/** Not examined */
	Unexamined: `0`,
	/** RoHS 6 */
	Correspondence6: `1`,
	/** RoHS 10 */
	Correspondence10: `2`,
	/** Incompatible */
	Incompatible: `9`,
} as const;
type RoHSType = typeof RoHSType[keyof typeof RoHSType];
export { RoHSType };

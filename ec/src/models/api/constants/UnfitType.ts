/**
 * Unfit type
 */
const UnfitType = {
	/** Not unfit */
	NotUnfit: `0`,

	/** Expedite delivery */
	ExpediteUnfit: `1`,

	/** Large mouth */
	BigOrderUnfit: `2`,

	/** Custom order */
	CustomOrderUnfit: `3`,

	/** Non-standard */
	NonstandardUnfit: `4`,

	/** Unregistered */
	UnregisteredUnfit: `5`,

	/** Multiple brands unfit */
	MultipleBrandUnfit: `6`,

	/** Business unit unfit */
	BusinessUnitUnfit: `7`,

	/** Each time unfit */
	EachTimeUnfit: `8`,

	/** Other unfit */
	OtherUnfit: `9`,

	/** System error */
	SystemError: `S`,
};
type UnfitType = typeof UnfitType[keyof typeof UnfitType];

export default UnfitType;

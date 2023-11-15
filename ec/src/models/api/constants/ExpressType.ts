/** Express type */
const ExpressType = {
	/** ExpressType T0 */
	ExpressTypeT0: `T0`,

	/** ExpressType A0 */
	ExpressTypeA0: `A0`,

	/** ExpressType 0A */
	ExpressType0A: `0A`,

	/** ExpressType A1 */
	ExpressTypeA1: `A1`,

	/** ExpressType B0 */
	ExpressTypeB0: `B0`,

	/** ExpressType C0 */
	ExpressTypeC0: `C0`,

	/** ExpressType Z0 */
	ExpressTypeZ0: `Z0`,

	/** ExpressType L0 */
	ExpressTypeL0: `L0`,

	/** ExpressType V0 */
	ExpressTypeV0: `V0`,
} as const;

type ExpressType = typeof ExpressType[keyof typeof ExpressType];
export default ExpressType;

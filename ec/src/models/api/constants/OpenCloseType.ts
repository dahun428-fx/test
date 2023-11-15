export const OpenCloseType = {
	OPEN: '1',
	CLOSE: '2',
	DISABLE: '3',
} as const;
export type OpenCloseType = typeof OpenCloseType[keyof typeof OpenCloseType];

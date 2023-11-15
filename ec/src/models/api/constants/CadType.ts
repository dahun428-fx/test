export const CadType = {
	'2D': '1',
	'3D': '2',
	'2D_3D': '1,2',
} as const;
export type CadType = typeof CadType[keyof typeof CadType];

export const CadTypeParam = {
	/** 2D */
	'2D': '10',
	/** 3D */
	'3D': '01',
	/** 2D/3D */
	'2D_3D': '11',
};

export type CadTypeParam = typeof CadTypeParam[keyof typeof CadTypeParam];

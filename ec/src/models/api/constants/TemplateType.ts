export const TemplateType = {
	COMPLEX: '1',
	SIMPLE: '2',
	PATTERN_H: '3',
	WYSIWYG: '4',
	PU: '7',
} as const;
export type TemplateType = typeof TemplateType[keyof typeof TemplateType];

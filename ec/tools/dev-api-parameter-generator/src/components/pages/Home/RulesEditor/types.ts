export const ArrayRewriteMethod = {
	CONCAT: 'concat',
	REPLACE: 'replace',
	// recommended and default
	OVERWRITE: 'overwrite',
} as const;
export type ArrayRewriteMethod =
	typeof ArrayRewriteMethod[keyof typeof ArrayRewriteMethod];

export type Rule = {
	id: string;
	arrayRewriteMethod: ArrayRewriteMethod;
	response: string;
	errorMessage?: string;
};

export type Rules = {
	path?: string;
	ruleList: Rule[];
};

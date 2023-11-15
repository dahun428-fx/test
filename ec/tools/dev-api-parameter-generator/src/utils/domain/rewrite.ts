import { orverwrite, replace } from '@app/utils/dev/rewrite';
import merge from 'deepmerge';
import { ArrayRewriteMethod } from '@/components/pages/Home/RulesEditor/types';

export const rewrite = (payload: {
	actual: Record<string, unknown>;
	paramsList: {
		response: Record<string, unknown>;
		options: { array: ArrayRewriteMethod };
	}[];
}) => {
	const { actual, paramsList } = payload;
	let rewritten: Record<string, unknown> = JSON.parse(JSON.stringify(actual));

	for (const params of paramsList) {
		const options: merge.Options = {};

		if (params.options) {
			if (params.options.array === ArrayRewriteMethod.REPLACE) {
				options.arrayMerge = replace;
			} else if (params.options.array === ArrayRewriteMethod.OVERWRITE) {
				options.arrayMerge = orverwrite;
			}
		}

		try {
			rewritten = merge(rewritten, params.response, options);
		} catch (error) {
			return `Generation error (maybe array merge failed): ${error}`;
		}
	}

	return rewritten;
};

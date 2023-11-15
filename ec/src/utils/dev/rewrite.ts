import type { Options } from 'deepmerge';

/** replace array on dev:api */
export const replace = (
	destinationArray: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
	sourceArray: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => sourceArray;

/** overwrite array on dev:api */
export const orverwrite = (
	destinationArray: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
	sourceArray: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
	options?: Options
) => {
	sourceArray.forEach((source, index) => {
		if (
			destinationArray[index] &&
			typeof destinationArray[index] === 'object' &&
			!Array.isArray(destinationArray[index])
		) {
			const rewrittenSource: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
			Object.keys(source).forEach(key => {
				if (Array.isArray(source[key])) {
					rewrittenSource[key] = destinationArray[index][key];
					orverwrite(rewrittenSource[key], source[key], options);
				} else {
					rewrittenSource[key] = source[key];
				}
			});

			destinationArray[index] = {
				...destinationArray[index],
				...rewrittenSource,
			};
		} else {
			destinationArray[index] = source;
		}
	});
	return destinationArray;
};

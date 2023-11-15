import path from 'path';
import fs from 'fs-extra';
import type { Translation } from '@/i18n/types';

type Request = {
	/** i18n key path */
	path: string;
	/** message */
	message: string;
};

/**
 * 解析対象ファイルパス
 * - 調査対象が増えたなら、切り替えたり、コマンドライン引数で受け取れるようにする
 */
const targetPath = path.resolve(
	__dirname,
	'../../src/i18n/pc/resources/en/translation/index.ts'
);

/** 出力先ファイルパス */
const outputFilePath = path.resolve(__dirname, './request.tsv');

(async () => {
	// Using "as" is basically prohibited.
	const translation = (await import(targetPath)).default as Translation;

	const data = getRequestList(translation, '')
		.map(request => `${request.path}\t${request.message}`)
		.join('\n');

	// eslint-disable-next-line no-console
	console.log(data);

	fs.outputFileSync(outputFilePath, data);
})();

function getRequestList(translation: Translation, parent: string): Request[] {
	let requestList: Request[] = [];

	Object.keys(translation)
		.sort()
		.forEach(key => {
			const value = translation[key];
			const path = getPath(key, parent);
			if (typeof value === 'string') {
				if (value.endsWith('_E')) {
					requestList.push({
						path,
						message: value.substring(0, value.length - 2),
					});
				}
			} else if (typeof value === 'object' && value != null) {
				requestList = requestList.concat(getRequestList(value, path));
			} else {
				throw Error(`Invalid translation: key=${key}`);
			}
		});

	return requestList;
}

function getPath(key: string, parent: string) {
	return !parent ? key : `${parent}.${key}`;
}

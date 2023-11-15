/* eslint-disable */
import { generate } from './generate';
import fs from 'fs-extra';

/** generate対象ファイルディレクトリ */
const DIRECTORY_PATH = `../../../../ect-api-docs/`;

fs.readdir(DIRECTORY_PATH, (error: Error, files: string[]) => {
	if (error) {
		console.error(error);
		return;
	}

	for (const file of files) {
		if (!file.match(/\.xlsx$/)) {
			continue;
		}
		generate(`${DIRECTORY_PATH}${file}`);
	}
});

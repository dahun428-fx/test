import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';

const SRC = `../../config/src`;
const DIST = `../../config/dist`;

glob.sync(`${SRC}/*.ts`).forEach(async filePath => {
	const fileName = path.basename(filePath, '.ts');
	fs.outputJsonSync(
		`${DIST}/${fileName}.json`,
		(await import(filePath)).config,
		{ spaces: 2 }
	);
});

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import postcss from 'postcss';
import { cwd, argv } from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { unusedRemover } from './plugins';

main();

async function main() {
	const argv = await getArgv();

	const cssFilePath = argv.input;
	const plugin = unusedRemover(getUsedClasses(argv.classNames));

	postcss(plugin)
		.process(read(cssFilePath), { from: cssFilePath })
		.then(result => {
			const distDir = join(cwd(), 'dist');
			const outputFilePath = `${distDir}/optimized-${cssFilePath
				.split('/')
				.pop()}`;

			if (!existsSync(distDir)) {
				mkdirSync(distDir);
			}
			writeFileSync(outputFilePath, result.css);
			// eslint-disable-next-line no-console
			console.log(`Removed unused css. dist=${outputFilePath}`);
		})
		.catch(error => {
			// eslint-disable-next-line no-console
			console.error('Failed optimize css', cssFilePath, error);
		});
}

function read(filePath: string) {
	return readFileSync(filePath, { encoding: 'utf8' });
}

function getUsedClasses(filePath: string) {
	return read(filePath).split('\n');
}

async function getArgv() {
	return yargs(hideBin(argv))
		.option('input', {
			alias: 'i',
			type: 'string',
			description: 'Input file path',
		})
		.option('classNames', {
			alias: 'c',
			type: 'string',
			description: 'File path with class names used',
		})
		.demandOption(
			['input', 'classNames'],
			'Needs next params. [input, classNames]'
		).argv;
}

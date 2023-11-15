import cheerio from 'cheerio';
import fs from 'fs-extra';

main();

function main() {
	const filePath = getFilePath();

	const seriesList: Record<string, string | null>[] = fs.readJSONSync(filePath);
	const size = seriesList.length;

	const classRecords = new Map<string, Set<string>>();
	const idRecords = new Map<string, Set<string>>();
	const dataRecords = new Map<string, Set<string>>();
	const seriesRecords = new Map<string, Set<string>>();

	// eslint-disable-next-line no-console
	console.log(`Loading data... [${seriesList.length}]`);

	seriesList.forEach((series, index) => {
		if (index % 100 === 0 || index + 1 === size) {
			// eslint-disable-next-line no-console
			console.log(
				`Analyzing ... [${index + 1} / ${size}] - "${series.series_name}"`
			);
		}

		for (const [key, value] of Object.entries(series)) {
			if (value != null) {
				const { classes, ids, dataAttrs } = extractClassFromHtml(value);
				if (classes.length) {
					classRecords.set(key, mergeSet(classes, classRecords.get(key)));
				}

				if (ids.length) {
					idRecords.set(key, mergeSet(ids, idRecords.get(key)));
				}

				if (dataAttrs.length) {
					dataRecords.set(key, mergeSet(ids, dataRecords.get(key)));
				}

				if (classes.length || ids.length || dataAttrs.length) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const code = series.series_code!;
					seriesRecords.set(code, mergeSet([key], seriesRecords.get(code)));
				}
			}
		}
	});

	// eslint-disable-next-line no-console
	console.log('------------- Analyzed -------------');

	output(classRecords, 'class');
	output(idRecords, 'id');
	output(dataRecords, 'data');
	outputSeriesList(seriesRecords);

	// eslint-disable-next-line no-console
	console.log('------------- Generated -------------');
}

function extractClassFromHtml(mayBeHtml: string) {
	const $ = cheerio.load(mayBeHtml);

	return {
		classes: extractWithAttr($, 'class'),
		ids: extractWithAttr($, 'id'),
		dataAttrs: extractWithAttr($, 'data'),
	};
}

function extractWithAttr($: cheerio.Root, name: string) {
	const data: string[] = [];
	const elWithAttr = $(`[${name}]`);
	if (elWithAttr.length) {
		elWithAttr.each((_, el) => {
			const attr = $(el).attr(name);
			attr && data.push(...attr.split(' '));
		});
	}
	return data;
}

function mergeSet(data: string[], set: Set<string> | undefined) {
	if (set == null) {
		set = new Set<string>();
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	data.forEach(d => set!.add(d));
	return set;
}

function getFilePath() {
	const filePath = process.argv[2];
	if (!filePath) {
		// eslint-disable-next-line no-console
		console.error('Please provide input file path (json)');
		process.exit(-1);
	}
	return filePath;
}

function output(records: Map<string, Set<string>>, name: string) {
	const all: string[] = [];

	Array.from(records.entries()).forEach(([key, value], index, entries) => {
		// eslint-disable-next-line no-console
		console.log(`Generating ... [${index + 1} / ${entries.length}] "${key}"`);
		const values = Array.from(value);
		if (values.length) {
			all.push(...values);
			fs.outputFileSync(`./dist/${name}/${key}.txt`, values.join('\n'));
		}
	});

	// eslint-disable-next-line no-console
	console.log(`Generating ... "used-legacy-${name}"`);
	fs.outputFileSync(
		`./dist/${name}/used-legacy-${name}.txt`,
		Array.from(new Set(all)).sort().join('\n')
	);
}

function outputSeriesList(records: Map<string, Set<string>>) {
	fs.outputFileSync(
		`./dist/series-with-html-list.txt`,
		Array.from(records.entries())
			.map(([seriesCode, columns]) => `${seriesCode}\t${Array.from(columns)}`)
			.join('\n')
	);
}

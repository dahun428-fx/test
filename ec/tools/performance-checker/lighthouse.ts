import { launch } from 'chrome-launcher';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dayjs from 'dayjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from 'lighthouse';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { userAgents } from 'lighthouse/lighthouse-core/config/constants';
import { pages, sites } from './config';

// Lighthouse config
const config = {
	logLevel: 'error',
	output: 'json',
	onlyCategories: ['performance'],
	formFactor: 'desktop',
	screenEmulation: {
		mobile: false,
		width: 1350,
		height: 940,
		deviceScaleFactor: 1,
		disabled: false,
	},
	emulatedUserAgent: userAgents.desktop,
};

// 試行回数
const MAX = 10;

(async () => {
	const chrome = await launch({ chromeFlags: ['--headless'] });
	const options = {
		...config,
		port: chrome.port,
		extraHeaders: {
			// TODO: 以下は環境変数に設定すべき
			authorization: 'Basic bWlzdW1pd2ViOm1pc3VtaW1pc3VtaQ==',
		},
	};

	const lines = [];

	for (const site of sites) {
		for (const page of pages) {
			let sum = 0;

			const url = `${site.origin}${page.path}`;
			const date = dayjs().format('YYYY/MM/DD');
			const time = dayjs().format('HH:mm:ss');
			const line = [date, site.name, time, page.name, url];

			for (let i = 0; i < MAX; i++) {
				const result = await lighthouse(url, options);
				const score =
					JSON.parse(result.report).categories.performance.score * 100;

				sum += score;

				line.push(String(score));
				// eslint-disable-next-line no-console
				console.log(url, score);
			}
			line.push(String(sum / MAX));
			lines.push(line.join('\t'));
			// fs.outputFileSync(
			// 	`./output/lighthouse/${site.name}/${page.name}.html`,
			// 	result.report
			// );
		}
	}
	await chrome.kill();

	const report = `${lines.join('\n')}\n`;
	fs.outputFileSync(`./output/lighthouse/report.tsv`, report);
})();

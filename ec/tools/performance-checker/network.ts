import axios from 'axios';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import { pages, sites } from './config';

// 試行回数
const MAX = 10;

(async () => {
	const lines = [];
	for (const site of sites) {
		for (const page of pages) {
			const url = `${site.origin}${page.path}`;
			const date = dayjs().format('YYYY/MM/DD');
			const time = dayjs().format('HH:mm:ss');
			const line = [date, site.name, time, page.name, url];

			let sum = 0;
			for (let i = 1; i <= MAX; i++) {
				const start = Date.now();
				// 何かがエラーになれば throw して実行を止める
				await axios.get(url, {
					auth: {
						// TODO: 以下は環境変数に設定すべき
						username: 'misumiweb',
						password: 'misumimisumi',
					},
				});
				const ms = Date.now() - start;
				sum += ms;
				// eslint-disable-next-line no-console
				console.log(`${url} ${ms}ms`);
				line.push(`${ms}`);
			}
			// ミリ秒平均
			line.push(`${(sum / MAX).toFixed(2)}`);
			lines.push(line.join('\t'));
		}
	}

	const report = `${lines.join('\n')}\n`;
	fs.outputFileSync(`./output/network/report.tsv`, report);
})();

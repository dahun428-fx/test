/* eslint-disable no-console */
import { WriteStream } from 'fs';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { configs } from './config';
import { targets } from './targets';

dotenv.config({ path: '.env.local' });

if (!process.env.MISUMI_BASIC_AUTH_USER) {
	console.error('Error: Basic auth user name not found in .env.local');
	process.exit(1);
}

if (!process.env.MISUMI_BASIC_AUTH_PASSWORD) {
	console.error('Error: Basic auth password not found in .env.local');
	process.exit(1);
}

configs.forEach(config => {
	const app = express();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use('/', async (request, response) => {
		const method = request.method.toLowerCase();
		if (method !== 'get' && method !== 'post') {
			console.error(`Error: unknown method: ${request.method}`);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let res: AxiosResponse<WriteStream, any> | undefined = undefined;
		try {
			if (method === 'get') {
				res = await axios.get<WriteStream>(`${config.dest}${request.url}`, {
					responseType: 'stream',
					auth: {
						username: process.env.MISUMI_BASIC_AUTH_USER ?? '',
						password: process.env.MISUMI_BASIC_AUTH_PASSWORD ?? '',
					},
				});
			} else if (method === 'post') {
				let data = request.body;
				let params: URLSearchParams | undefined = undefined;
				if (
					request.headers['content-type'] ===
					'application/x-www-form-urlencoded'
				) {
					params = new URLSearchParams();
					Object.entries(request.body).forEach(([key, value]) => {
						if (params && typeof value === 'string') {
							params.append(key, value);
						}
					});
					data = params.toString();
				}

				console.log('============================================ post');
				console.log(request.path);
				console.log(data);

				res = await axios.post<WriteStream>(
					`${config.dest}${request.url}`,
					data,
					{
						responseType: 'stream',
						auth: {
							username: process.env.MISUMI_BASIC_AUTH_USER ?? '',
							password: process.env.MISUMI_BASIC_AUTH_PASSWORD ?? '',
						},
					}
				);
			}
		} catch (error) {
			console.error(error);
			return;
		}

		if (res) {
			response.set(res.headers);
			res.data.pipe(response);
			for (const [key, value] of Object.entries(targets)) {
				if (request.path.match(new RegExp(key))) {
					response.status(value);
					break;
				}
			}
		} else {
			throw Error('Error: response not found');
		}
	});

	app.listen(config.port);
	console.log(`Listening port: ${config.port}`);
});

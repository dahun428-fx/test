/* eslint-disable no-console */
import { WriteStream } from 'fs';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { configs } from './config';

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

	app.use('/', async (request, response, next) => {
		if (request.method.toLowerCase() !== 'get') {
			console.error(`Error: unknown method: ${request.method}`);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let res: AxiosResponse<WriteStream, any>;
		try {
			res = await axios.get<WriteStream>(`${config.dest}${request.url}`, {
				responseType: 'stream',
				auth: {
					username: process.env.MISUMI_BASIC_AUTH_USER ?? '',
					password: process.env.MISUMI_BASIC_AUTH_PASSWORD ?? '',
				},
			});
		} catch (error) {
			console.error(error);
			next(error);
			return;
		}

		if (res) {
			// NOTE: IE11 doesn't allow CSS links without Content-Type: text/css set in response header
			response.set(res.headers);
			res.data.pipe(response);
		}
	});

	app.listen(config.port);
	console.log(`Listening port: ${config.port}`);
});

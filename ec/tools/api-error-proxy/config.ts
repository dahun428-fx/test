import { Config } from './types';

export const configs: Config[] = [
	{
		// ect-api
		port: 3002,
		dest: 'https://stg0-api.my.misumi-ec.com',
	},
	{
		// auth-api
		port: 3003,
		dest: 'https://stg0-my.mauth.misumi-ec.com',
	},
	{
		// crm-api
		port: 3004,
		dest: 'https://stg-recommend-my.misumi-ec.com',
	},
	{
		// cadenas-api
		port: 3005,
		dest: 'https://stg0-my.misumi-ec.com',
	},
	{
		// sinus-api
		port: 3006,
		dest: 'https://stg.mex.misumi-ec.com',
	},
];

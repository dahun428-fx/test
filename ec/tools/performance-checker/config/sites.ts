type Site = {
	name: string;
	origin: string;
};

export const sites: Site[] = [
	{
		name: 'stg0',
		origin: 'https://stg0-my.misumi-ec.com',
	},
	{
		// for testing the performance of reverse proxy implemented on vercel
		name: 'vercel',
		origin: 'https://test-proxy-ec-web-my.vercel.app',
	},
];

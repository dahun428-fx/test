/** @type {import('next').NextConfig} */
module.exports = {
	productionBrowserSourceMaps: true,
	reactStrictMode: true,
	trailingSlash: true,
	experimental: {
		externalDir: true,
	},
};

//=============================================================================
// webpack plugins

/**
 * npm run analyze-bundle
 * でバンドルされたJSのanalyzeを実行。
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
// warning if you attempt to import a file with invalid casing
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextBuildId = require('next-build-id');

//=============================================================================
// load app config

// APP_CONFIGに基づくconfigの設定を取得
// const configName = process.env.APP_CONFIG;
const configName = 'my-local';
if (!configName) {
	throw Error('APP_CONFIG must be set');
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(`./config/dist/${configName}.json`);
if (!config) {
	throw Error(`config file APP_CONFIG=${configName} not found`);
}

//=============================================================================
// settings

/**
 * _nextフォルダの配置を変更するかどうか
 * NOTE: npm run dev(next dev)で起動すると、自動でNODE_ENVにdevelopmentがセットされる。
 */
const shouldRewrite = !(
	process.env.NODE_ENV === 'development' ||
	process.env.SUPPRESS_ROUTING_REWRITE === 'true'
);

/** pages/ 以下のどのファイルを page file と Next.js に認識させるか */
const pageExtensions =
	process.env.BUILD_TARGET === 'mobile' ? ['mobile.tsx'] : ['pc.tsx'];

/** mobile向けsystemパス */
const mobileSystemPath = '/vona2/mobile/system';

/** pc向けsystemパス */
const pcSystemPath = '/vona2/pc/system';

/** system パス */
const systemPath = shouldRewrite
	? process.env.BUILD_TARGET === 'mobile'
		? mobileSystemPath
		: pcSystemPath
	: '';

//=============================================================================
// config

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
	experimental: {
		scrollRestoration: true,
	},
	productionBrowserSourceMaps:
		process.env.ENABLE_GENERATE_SOURCE_MAPS === 'true',
	reactStrictMode: true,
	trailingSlash: true,
	pageExtensions: ['api.ts', ...pageExtensions],
	publicRuntimeConfig: { config },
	webpack: config => {
		config.plugins.push(new CaseSensitivePathsPlugin());
		return config;
	},
	// 本番環境ではアセットの配置先を /_next/* から/vona2/system/_next/* に変更
	assetPrefix: systemPath,
	/** ルーティングのリライト設定 */
	rewrites() {
		return [
			{
				// /_next/* へのアクセスを /vona2以下 ファイルパス でアクセス可能にする。
				// NOTE: CDNで/_next/* への振り分け設定がない問題の対応。
				source: systemPath + '/_next/:path*',
				destination: '/_next/:path*',
			},
			{
				// /api/* へのアクセスを /vona2以下ファイルパスでアクセス可能にする。
				// NOTE: CDNで/api/* への振り分け設定がない問題の対応。
				source: systemPath + '/api/:path*',
				destination: '/api/:path*',
			},
		];
	},
	/** build id の設定 */
	generateBuildId() {
		// NOTE: describe=true の場合、タグが付与されているとタグ、そうでなければ commit hash
		return nextBuildId({ dir: __dirname, describe: true });
	},
	images: {
		// 本番環境ではnext/imageの参照先を/vona2 配下に (next/imageはassetPrefixの設定が反映されないため）
		path: systemPath + '/_next/image',
		domains: ['content.misumi-ec.com'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'content.misumi-ec.com',
			},
		],
	},
});

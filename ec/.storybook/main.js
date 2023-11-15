const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

// 以下の記事を参考しました：
// https://zenn.dev/thim/articles/7c8ceba730dad35d27dc#%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E7%B7%A8%E9%9B%86
module.exports = {
	features: { previewCsfV3: true, interactionsDebugger: true },
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-a11y',
		'@storybook/addon-interactions',
		'storybook-addon-next-router',
	],
	webpackFinal: async config => {
		config.resolve.plugins.push(
			new TsconfigPathsPlugin({ extensions: config.resolve.extensions })
		);
		config.module.rules.push({
			test: /\.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1,
						modules: {
							localIdentName: '[local]___[hash:base64:2]',
						},
					},
				},
				'sass-loader',
			],
		});
		// next-build-id モック
		config.resolve.alias['next-build-id'] = require.resolve(
			'./mocks/next-build-id'
		);

		return config;
	},
};

import '!style-loader!css-loader!sass-loader!../src/styles/pc/normalize.scss';
import { setConfig } from 'next/config';
import { WithNextRouter } from 'storybook-addon-next-router/dist/decorators';
import { RouterContext } from 'next/dist/shared/lib/router-context';
const configName = process.env.APP_CONFIG;
if (!configName) {
	throw Error('APP_CONFIG must be set');
}

const config = require(`../config/dist/${configName}.json`);
if (!config) {
	throw Error(`config file APP_CONFIG=${configName} not found`);
}

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	options: {
		storySort: {
			order: [
				'components',
				['pc', ['ui', 'pages', 'layouts'], 'mobile'],
				'hooks',
			],
		},
	},
	nextRouter: {
		Provider: RouterContext.Provider,
		locale: 'en',
	},
};

export const decorators = [WithNextRouter];

// storybook で runtime config を正しく取得できない事象に対応
// https://github.com/misumi-org/order-web-id/issues/519
setConfig({ publicRuntimeConfig: { config } });

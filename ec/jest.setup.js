jest.mock('next/config', () => () => ({
	publicRuntimeConfig: {
		config: require('./config/dist/my-local.json'),
	},
}));

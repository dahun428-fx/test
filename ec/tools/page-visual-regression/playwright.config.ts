import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	projects: [
		{
			name: 'mobile',
			use: {
				...devices['iPhone 12 Pro'],
				deviceScaleFactor: 1,
				defaultBrowserType: 'chromium',
				channel: 'chrome',
			},
		},
	],
	fullyParallel: true,
	workers: 16,
	timeout: 60 * 1000,
	reporter: [['line'], ['html']],
});

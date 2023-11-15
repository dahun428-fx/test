import { readFileSync } from 'fs';
import { test, expect } from '@playwright/test';

// test.spec.ts という名前は良い名前ではないので真似しないでください。

readFileSync('./urls.txt')
	.toString()
	.split('\n')
	.map(url => url.trim())
	.filter(url => url)
	.forEach(url => {
		test(url, async ({ page }) => {
			await page.goto(url);
			await expect(page).toHaveScreenshot({
				fullPage: true,
				scale: 'device',
				animations: 'disabled',
			});
		});
	});

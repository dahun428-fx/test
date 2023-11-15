import { Story } from '@storybook/react';
import { CategoryListSpec, Props } from './CategoryListSpec';

export default {
	component: CategoryListSpec,
	args: {
		categoryList: [
			{
				categoryCode: 'M3308010000',
				categoryName: 'Screws for Building Materials',
				seriesCount: 34,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				categoryCode: 'M3301110000',
				categoryName: 'Hex Socket Head Cap Screws',
				seriesCount: 32,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				categoryCode: 'M2003060000',
				categoryName: 'Screw Fittings, Screw-In Type Flanges',
				seriesCount: 29,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
		],
	},
};

export const _CategoryListSpec: Story<Props> = args => (
	<CategoryListSpec {...args} />
);

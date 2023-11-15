import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrandCategory } from './BrandCategory';

export default {
	component: BrandCategory,
	args: {
		brandName: 'MISUMI_Test',
		brandCode: 'MSM1',
		brandUrlCode: 'misumi',
		categoryList: [
			{
				categoryCode: 'fs_machining',
				categoryName: 'Cutting Tools',
				discontinuedProductFlag: '0',
			},
			{
				categoryCode: 'T0101000000',
				categoryName: 'Carbide End Mills',
				discontinuedProductFlag: '0',
			},
			{
				categoryCode: 'T0101010000',
				categoryName: 'Carbide Square End Mills',
				discontinuedProductFlag: '0',
			},
		],
		categoryCode: 'T0101010100',
		categoryName: 'Square End Mills (Carbide)',
	},
} as ComponentMeta<typeof BrandCategory>;

export const Default: ComponentStory<typeof BrandCategory> = args => (
	<BrandCategory {...args} />
);

import { Story } from '@storybook/react';
import { BrandListSpec, Props } from './BrandListSpec';

export default {
	component: BrandListSpec,
	args: {
		brandList: [
			{
				brandCode: 'MSM1',
				brandUrlCode: 'misumi',
				brandName: 'MISUMI_Test',
				seriesCount: 67,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				brandCode: 'AON1',
				brandUrlCode: 'as_one',
				brandName: 'AS ONE',
				seriesCount: 2,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				brandCode: 'IMA1',
				brandUrlCode: 'imao',
				brandName: 'IMAO CORPORATION',
				seriesCount: 2,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				brandCode: 'ECE1',
				brandUrlCode: 'earthchian',
				brandName: 'ECE',
				seriesCount: 1,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				brandCode: 'NOS1',
				brandUrlCode: 'nitoms',
				brandName: 'NITOMS',
				seriesCount: 1,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				brandCode: 'TRC1',
				brandUrlCode: 'trusco',
				brandName: 'TRUSCO',
				seriesCount: 1,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				brandCode: 'DUMMY-HIDDEN',
				brandName: 'DUMMY-HIDDEN',
				seriesCount: 1,
				hiddenFlag: '1',
				selectedFlag: '0',
			},
		],
		cValue: {
			cValueFlag: '1',
			seriesCount: 29,
			hiddenFlag: '0',
		},
	},
};

export const _BrandListSpec: Story<Props> = args => <BrandListSpec {...args} />;

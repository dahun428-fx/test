import { Story } from '@storybook/react';
import { VolumeDiscountTable, Props } from './VolumeDiscountTable';

export default {
	component: VolumeDiscountTable,
	args: {
		volumeDiscountList: [
			{
				minQuantity: 1,
				maxQuantity: 49,
				unitPrice: 16.58,
				daysToShip: 1,
			},
			{
				minQuantity: 50,
				maxQuantity: 74,
				unitPrice: 15.73,
				daysToShip: 1,
			},
			{
				minQuantity: 75,
				maxQuantity: 99,
				unitPrice: 14.9,
				daysToShip: 1,
			},
			{
				minQuantity: 100,
				maxQuantity: 200,
				unitPrice: 13.56,
				daysToShip: 1,
			},
			{
				minQuantity: 201,
				unitPrice: 13.56,
				daysToShip: 99,
			},
		],
		currencyCode: 'MYR',
		isPurchaseLinkUser: 0,
	},
};

export const _VolumeDiscountTable: Story<Props> = args => (
	<VolumeDiscountTable {...args} />
);

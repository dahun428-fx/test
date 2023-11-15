import { ComponentStoryObj, Meta } from '@storybook/react';
import { VolumeDiscountList } from './VolumeDiscountList';
import { CurrencyProvider } from '@/components/mobile/ui/text/Price';
import { config } from '@/config';

type Story = ComponentStoryObj<typeof VolumeDiscountList>;

export default {
	component: VolumeDiscountList,
	decorators: [
		story => (
			<CurrencyProvider ccyCode={config.defaultCurrencyCode}>
				{story()}
			</CurrencyProvider>
		),
	],
	args: {
		volumeDiscountList: [
			{
				daysToShip: 5,
				maxQuantity: 16086,
				minQuantity: 1,
				unitPrice: 0.41,
			},
			{
				daysToShip: 63,
				maxQuantity: 32172,
				minQuantity: 16087,
				unitPrice: 0.41,
			},
			{
				daysToShip: 99,
				minQuantity: 32173,
				unitPrice: 0.41,
			},
		],
	},
} as Meta<typeof VolumeDiscountList>;

export const Default: Story = {};

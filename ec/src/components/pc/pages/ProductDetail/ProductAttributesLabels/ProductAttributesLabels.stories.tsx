import { ComponentStoryObj, Meta } from '@storybook/react';
import { ProductAttributesLabels } from './ProductAttributesLabels';
import { Flag } from '@/models/api/Flag';

type Story = ComponentStoryObj<typeof ProductAttributesLabels>;

export default {
	component: ProductAttributesLabels,
} as Meta<typeof ProductAttributesLabels>;

export const DefaultAll: Story = {
	args: {
		campaignEndDate: '2022/12/31',
		userCampaignApplyFlag: Flag.TRUE,
		gradeTypeDisp: 'Ecomony',
		iconTypeList: [
			{
				iconType: '1000',
				iconTypeDisp: 'Volume Discount',
			},
			{
				iconType: '1000',
				iconTypeDisp: 'Expansion of standard',
			},
		],
		discontinuedProductFlag: Flag.FALSE,
		minShortestDaysToShip: 0,
		minStandardDaysToShip: 0,
		maxStandardDaysToShip: 0,
	},
};

export const DisplayDiscontinuedIcon: Story = {
	args: { discontinuedProductFlag: Flag.TRUE },
};

export const DisplayCampaignDiscountIcon: Story = {
	args: { campaignEndDate: '2022/12/31', userCampaignApplyFlag: Flag.TRUE },
};

export const DisplayGradeIcon: Story = {
	args: { gradeTypeDisp: 'Ecomony' },
};

export const DisplayIconTypeList: Story = {
	args: {
		iconTypeList: [
			{
				iconType: '1000',
				iconTypeDisp: 'Volume Discount',
			},
			{
				iconType: '1000',
				iconTypeDisp: 'Expansion of standard',
			},
		],
	},
};

export const DisplayShipsTodayIconForShippedSameDay: Story = {
	args: {
		discontinuedProductFlag: Flag.FALSE,
		minShortestDaysToShip: 0,
		minStandardDaysToShip: 0,
		maxStandardDaysToShip: 0,
	},
};

import { ComponentStoryObj, Meta } from '@storybook/react';
import { StorkList } from './StorkList';

type Story = ComponentStoryObj<typeof StorkList>;

export default {
	component: StorkList,
	args: {
		expressList: [
			{
				expressType: 'T0',
				expressTypeDisp: 'Express T',
				chargeType: '1',
				charge: 200,
				expressDeadline: '12:00',
			},
			{
				expressType: 'A0',
				expressTypeDisp: 'Express A',
				chargeType: '1',
				charge: 200,
				expressDeadline: '15:00',
			},
			{
				expressType: 'B0',
				expressTypeDisp: 'Express B',
				chargeType: '2',
				charge: 200,
				expressDeadline: '17:00',
			},
			{
				expressType: 'C0',
				expressTypeDisp: 'Express C',
				chargeType: '2',
				charge: 100,
				expressDeadline: '17:00',
			},
		],
	},
} as Meta<typeof StorkList>;

export const Default: Story = {};

import { Story } from '@storybook/react';
import { ExpressServiceTable, Props } from './ExpressServiceTable';

export default {
	component: ExpressServiceTable,
	args: {
		expressList: [
			{
				expressType: 'T0',
				expressTypeDisp: 'Express T',
				chargeType: '1',
				charge: 1600,
				expressDeadline: '12:00',
			},
			{
				expressType: 'A0',
				expressTypeDisp: 'Express A',
				chargeType: '1',
				charge: 800,
				expressDeadline: '18:00',
			},
			{
				expressType: '0A',
				expressTypeDisp: 'Express B',
				chargeType: '2',
				charge: 300,
				expressDeadline: '15:00',
			},
		],
	},
};

export const Default: Story<Props> = args => <ExpressServiceTable {...args} />;

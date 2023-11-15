import { Story } from '@storybook/react';
import React from 'react';
import { DaysToShipListSpec, Props } from './DaysToShipListSpec';

export default {
	component: DaysToShipListSpec,
	args: {
		daysToShipList: [
			{
				daysToShip: 0,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				daysToShip: 3,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				daysToShip: 4,
				hiddenFlag: '0',
				selectedFlag: '1',
			},
			{
				daysToShip: 5,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				daysToShip: 9,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
			{
				daysToShip: 99,
				hiddenFlag: '0',
				selectedFlag: '0',
			},
		],
		/* eslint-disable @typescript-eslint/no-empty-function */
		onChange: () => {},
		onSelectHiddenSpec: () => {},
		sendLog: () => {},
		/* eslint-enable */
	},
};

export const _DaysToShipListSpec: Story<Props> = args => (
	<div style={{ width: '1200px' }}>
		<DaysToShipListSpec {...args} />
	</div>
);

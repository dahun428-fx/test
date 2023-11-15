import { ComponentStoryObj, Meta } from '@storybook/react';
import { SeriesFilterPanel } from './SeriesFilterPanel';
import { categoryListMock } from './SeriesFilterPanel.mocks';

type Story = ComponentStoryObj<typeof SeriesFilterPanel>;

export default {
	component: SeriesFilterPanel,
	decorators: [
		story => (
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>{story()}</div>
		),
	],
} as Meta<typeof SeriesFilterPanel>;

export const Base: Story = {
	args: {
		categoryList: categoryListMock,
		daysToShipList: [],
		cadTypeList: [],
		brandList: [],
	},
};

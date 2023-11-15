import { ComponentStoryObj, Meta } from '@storybook/react';
import { SpecPanel } from './SpecPanel';
import {
	alterationSpecList,
	partNumberSpecMocks,
} from '@/components/pc/pages/ProductDetail/templates/Complex/SpecPanel/SpecPanel.mocks';

type Story = ComponentStoryObj<typeof SpecPanel>;

export default {
	component: SpecPanel,
	decorators: [
		story => (
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>{story()}</div>
		),
	],
} as Meta<typeof SpecPanel>;

export const Base: Story = {
	args: {
		specList: partNumberSpecMocks,
		daysToShipList: [],
		cadTypeList: [],
		alterationSpecList,
	},
};

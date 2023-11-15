import { ComponentStoryObj, Meta } from '@storybook/react';
import { listCategory } from './CategoryPopover.mocks';
import { CategoryPopoverTrigger } from './CategoryPopoverTrigger';

type Component = typeof CategoryPopoverTrigger;
type Story = ComponentStoryObj<Component>;

export default {
	component: CategoryPopoverTrigger,
	args: {
		children: (
			<div
				style={{
					width: '300px',
					height: '150px',
					backgroundColor: '#ddd',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '20px',
				}}
			>
				The inserted UI are displayed
			</div>
		),
	},
	decorators: [
		story => (
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				<div style={{ display: 'inline-block', width: '260px' }}>{story()}</div>
			</div>
		),
	],
} as Meta<Component>;

export const Default: Story = {
	args: {
		categoryList: [...listCategory],
	},
};

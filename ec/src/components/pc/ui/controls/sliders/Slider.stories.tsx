import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Slider } from './Slider';

type T = typeof Slider;
type Story = ComponentStoryObj<T>;

export default {
	component: Slider,
	decorators: [story => <div style={{ margin: '200px' }}>{story()}</div>],
} as ComponentMeta<T>;

export const _Slider: Story = {
	args: {
		defaultValue: 'C',
		values: 'ABCDEFJHIJKLMNOPQRSTUVWXYZ'.split(''),
		style: { width: '180px' },
	},
};

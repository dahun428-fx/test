import { Story } from '@storybook/react';
import { SpecHeading } from './SpecHeading';

export default {
	component: SpecHeading,
	argTypes: {},
};

export const _SpecHeading: Story = args => (
	<SpecHeading {...args}>Spec heading</SpecHeading>
);

import { Story } from '@storybook/react';
import { SectionHeading } from './SectionHeading';

export default {
	component: SectionHeading,
	argTypes: {},
};

export const _SectionHeading: Story = args => (
	<SectionHeading {...args}>section heading</SectionHeading>
);

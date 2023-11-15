import { Story } from '@storybook/react';
import { SectionHeading } from './index';

export default {
	component: SectionHeading,
	argTypes: {},
};

export const _SectionHeading: Story = args => (
	<SectionHeading {...args}>h2 heading</SectionHeading>
);

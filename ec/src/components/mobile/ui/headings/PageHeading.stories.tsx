import { Story } from '@storybook/react';
import { PageHeading } from './PageHeading';

export default {
	component: PageHeading,
	argTypes: {},
};

export const _PageHeading: Story = args => (
	<PageHeading {...args}>h1 heading</PageHeading>
);

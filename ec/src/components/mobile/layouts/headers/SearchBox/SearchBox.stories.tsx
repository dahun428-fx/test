import { Story } from '@storybook/react';
import { SearchBox, Props } from './SearchBox';

export default {
	component: SearchBox,
	args: {},
};

export const _SearchBox: Story<Props> = args => <SearchBox {...args} />;

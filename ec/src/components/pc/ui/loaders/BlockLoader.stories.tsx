import { Story } from '@storybook/react';
import { BlockLoader } from './BlockLoader';

export default {
	component: BlockLoader,
};
export const _BlockLoader: Story = args => <BlockLoader {...{ ...args }} />;

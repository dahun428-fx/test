import { ComponentStoryObj, Meta } from '@storybook/react';
import { CatchCopy } from './CatchCopy';

type Story = ComponentStoryObj<typeof CatchCopy>;

const CatchCopyComponent = ({}) => {
	return <CatchCopy />;
};

export default {
	component: CatchCopy,
} as Meta<typeof CatchCopyComponent>;

export const Default: Story = {
	args: {
		catchCopy:
			'<b>The Misumi original</b> fine intermediate flute length is available at a reasonable price,<i>The Misumi original</i> fine intermediate flute length is available at a reasonable price. The Misumi original fine intermediate flute length is available at a reasonable price,The Misumi original fine intermediate flute length is available at a reasonable price',
	},
};

import { Story } from '@storybook/react';
import { OverlayLoader } from '@/components/pc/ui/loaders/OverlayLoader';

export default {
	component: OverlayLoader,
};
export const _OverlayLoader: Story = args => (
	<OverlayLoader {...{ show: true, ...args }} />
);

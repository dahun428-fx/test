import { ComponentStoryObj } from '@storybook/react';
import { MessageToast } from './MessageToast';

type Story = ComponentStoryObj<typeof MessageToast>;

export default {
	component: MessageToast,
	args: {
		shows: true,
		message: 'Part Number confirmed',
		messageTheme: 'PARTNUMER_COMPLETE',
		delayTime: 5000,
	},
};

export const Default: Story = {};

export const PartNumberConfirmationToast: Story = {
	args: {
		shows: true,
		message: 'Part Number confirmed',
		messageTheme: 'PARTNUMER_COMPLETE',
		delayTime: 5000,
	},
};

export const NewMessageArrivedToast: Story = {
	args: {
		shows: true,
		message: 'New Message Arrived',
		messageTheme: 'MAIL',
		href: '#',
		icon: 'mail',
	},
};

import { Story } from '@storybook/react';
import { RelatedPartNumberList, Props } from './RelatedPartNumberList';

export default {
	component: RelatedPartNumberList,
	args: {
		seriesCode: '110301998260',
		partNumber: 'BOX-NKJ2-3',
		relatedLinkFrameFlag: '0',
		rohsFrameFlag: '0',
	},
};

export const Default: Story<Props> = args => (
	<RelatedPartNumberList {...args} />
);

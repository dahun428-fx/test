import { Story } from '@storybook/react';
import { NagiLink } from './index';

export default {
	component: NagiLink,
	argTypes: {
		href: { control: { type: `text` } },
		newTab: { control: { type: `boolean` } },
	},
};

export const _NagiLink: Story = args => (
	<>
		<div>
			<NagiLink href="/" {...args}>
				Nagi Link (control操作用)
			</NagiLink>
		</div>
		<div>
			<NagiLink href="/" newTab={true}>
				Nagi Link (newTab)
			</NagiLink>
		</div>
		<div>
			<NagiLink href="/" theme="primary">
				Nagi Link primary theme
			</NagiLink>
		</div>
		<div>
			<NagiLink href="/" theme="secondary">
				Nagi Link secondary theme
			</NagiLink>
		</div>
		<div>
			<NagiLink href="/" disabled>
				Nagi Link disabled
			</NagiLink>
		</div>
	</>
);

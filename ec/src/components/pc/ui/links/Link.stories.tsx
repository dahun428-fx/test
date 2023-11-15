import { Story } from '@storybook/react';
import { Link } from './index';

export default {
	component: Link,
	argTypes: {
		href: { control: { type: `text` } },
		newTab: { control: { type: `boolean` } },
	},
};

export const _Link: Story = args => (
	<>
		<div>
			<Link href="/" {...args}>
				Link (control操作用)
			</Link>
		</div>
		<div>
			<Link href="/" newTab={true}>
				Link (newTab)
			</Link>
		</div>
		<div>
			<Link href="/" theme="primary">
				Link primary theme
			</Link>
		</div>
		<div>
			<Link href="/" theme="secondary">
				Link secondary theme
			</Link>
		</div>
	</>
);

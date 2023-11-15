import { Story } from '@storybook/react';
import { LinkListItem } from './LinkListItem';
import styles from './LinkListItem.stories.module.scss';

export default {
	component: LinkListItem,
	argTypes: {
		href: { control: { type: `text` } },
	},
};

export const _LinkListItem: Story = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd>
				<LinkListItem href="/" {...args}>
					Link List Item
				</LinkListItem>
			</dd>
		</dl>

		<dl className={styles.list}>
			<dt>Open new tab</dt>
			<dd>
				<LinkListItem href="/" newTab>
					Click here to open new tab
				</LinkListItem>
			</dd>
		</dl>
	</>
);

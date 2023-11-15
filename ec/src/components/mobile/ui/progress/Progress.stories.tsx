import { Story } from '@storybook/react';
import { Progress, Props } from './Progress';
import styles from './Progress.stories.module.scss';

export default {
	component: Progress,
	argTypes: {
		step: { control: { type: `number` } },
		maxStep: { control: { type: `number` } },
	},
};

export const _Progress: Story<Props> = args => (
	<>
		<dl className={styles.list}>
			<dt>Control</dt>
			<dd className={styles.description}>
				<Progress {...args} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>progressing</dt>
			<dd className={styles.description}>
				<Progress step={2} maxStep={5} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>completed</dt>
			<dd className={styles.description}>
				<Progress step={5} maxStep={5} />
			</dd>
		</dl>
	</>
);

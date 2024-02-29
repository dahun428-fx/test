import { Story } from '@storybook/react';
import { Rating } from './Rating';
import styles from './Rating.stories.module.scss';

export default {
	component: Rating,
	args: { rate: 4, displayType: 'inline' },
	argTypes: {},
};

export const _Rating: Story = args => (
	<>
		<div>
			<h1>Normal</h1>
			<Rating rate={4} {...args} />
		</div>
		<div>
			<h1>With suffix</h1>
			<Rating
				rate={4}
				{...args}
				suffix={
					<div className={styles.suffix}>
						<strong>100</strong> 2023/01/01
					</div>
				}
			/>
		</div>
	</>
);

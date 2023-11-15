import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import { Pagination, Props } from './Pagination';
import styles from './Pagination.stories.module.scss';

export default {
	component: Pagination,
	args: {
		page: 1,
		pageSize: 30,
		totalCount: 200,
		maxPageCount: 5,
	},
	argTypes: {
		page: {
			control: {
				type: 'number',
			},
		},
		pageSize: {
			options: [30, 45, 60],
			control: {
				type: 'radio',
			},
		},
		totalCount: {
			control: {
				type: 'number',
			},
		},
		maxPageCount: {
			options: [5, 10],
			control: {
				type: 'radio',
			},
		},
		onChange: { action: 'clicked' },
	},
};

/**
 * ページネーション
 *
 * TODO: 現在 Storybook では i18n を適用できなく、
 * 文言を正しく表示できない状態です。(2022/2)
 */
export const _Pagination: Story<Props> = args => (
	<>
		<dl className={styles.list}>
			<dt>（Control操作用）</dt>
			<dd>
				<Pagination {...args} />
			</dd>
		</dl>
		<div className={styles.separator} />
		<dl className={styles.list}>
			<dt> 1 of 1 </dt>
			<dd>
				<Pagination
					page={1}
					pageSize={30}
					totalCount={20}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt> 1 of 4 </dt>
			<dd>
				<Pagination
					page={1}
					pageSize={30}
					totalCount={100}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt> 2 of 4 </dt>
			<dd>
				<Pagination
					page={2}
					pageSize={30}
					totalCount={100}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt> 1 of 8, max page count is 5 (default) </dt>
			<dd>
				<Pagination
					page={1}
					pageSize={30}
					totalCount={240}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt> 4 of 8 </dt>
			<dd>
				<Pagination
					page={4}
					pageSize={30}
					totalCount={240}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt> 8 of 8 </dt>
			<dd>
				<Pagination
					page={8}
					pageSize={30}
					totalCount={240}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt> 8 of 20, max page count is 10</dt>
			<dd>
				<Pagination
					page={8}
					pageSize={30}
					totalCount={600}
					maxPageCount={10}
					onChange={action('Clicked')}
				/>
			</dd>
		</dl>
	</>
);

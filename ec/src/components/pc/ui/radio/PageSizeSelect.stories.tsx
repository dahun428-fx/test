import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { PageSizeSelect } from './PageSizeSelect';
import styles from './PageSizeSelect.stories.module.scss';

export default {
	component: PageSizeSelect,
} as ComponentMeta<typeof PageSizeSelect>;

/**
 * 表示件数選択ボタン
 */
export const _Example: ComponentStory<typeof PageSizeSelect> = () => {
	const [pageSizeDefault, setPageSizeDefault] = useState(30);
	const [pageSizeArranged, setPageSizeArranged] = useState(30);
	return (
		<>
			<dl className={styles.list}>
				<dt> default (page size list 指定なし) </dt>
				<dd className={styles.description}>
					<PageSizeSelect
						pageSize={pageSizeDefault}
						onChange={setPageSizeDefault}
					/>
				</dd>
			</dl>
			<dl className={styles.list}>
				<dt> size list arrange (30, 60, 90) </dt>
				<dd className={styles.description}>
					<PageSizeSelect
						pageSize={pageSizeArranged}
						pageSizeList={[30, 60, 90]}
						onChange={setPageSizeArranged}
					/>
				</dd>
			</dl>
		</>
	);
};

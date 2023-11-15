import { Story } from '@storybook/react';
import styles from './DaysToShip.stories.module.scss';
import { DaysToShip } from './index';

export default {
	component: DaysToShip,
	argTypes: {
		minDaysToShip: { control: { type: `number` } },
		maxDaysToShip: { control: { type: `number` } },
	},
};

/**
 * 出荷日数表示文言
 */
export const _DaysToShip: Story = args => (
	<>
		<dl className={styles.list}>
			<dt>（Control操作用）</dt>
			<dd>
				<DaysToShip {...args} />
			</dd>
		</dl>
		<div className={styles.separator} />
		<dl className={styles.list}>
			<dt>最小日数と最大日数に値が設定されていない場合</dt>
			<dd>
				<DaysToShip />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>最小日数と最大日数は 99 の場合</dt>
			<dd>
				<DaysToShip minDaysToShip={99} maxDaysToShip={99} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>最小日数と最大日数は 0 の場合</dt>
			<dd>
				<DaysToShip minDaysToShip={0} maxDaysToShip={0} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>最小日数は 0、最大日数は 0 ではない場合</dt>
			<dd>
				<DaysToShip minDaysToShip={0} maxDaysToShip={5} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>最小日数と最大日数は 1~98、かつ両方が同じの場合</dt>
			<dd>
				<DaysToShip minDaysToShip={5} maxDaysToShip={5} />
			</dd>
		</dl>
		<dl className={styles.list}>
			<dt>最小日数と最大日数は 1~98、かつ両方が異なる場合</dt>
			<dd>
				<DaysToShip minDaysToShip={5} maxDaysToShip={10} />
			</dd>
		</dl>
		<div className={styles.separator} />
		<dl className={styles.list}>
			<dt>className によりスタイルを修正</dt>
			<dd>
				<DaysToShip
					minDaysToShip={5}
					maxDaysToShip={10}
					className={styles.blue}
				/>
			</dd>
		</dl>
	</>
);

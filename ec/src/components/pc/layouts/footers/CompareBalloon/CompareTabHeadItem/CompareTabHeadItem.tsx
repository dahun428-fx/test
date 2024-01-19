import { FC } from 'react';
import styles from '../CompareBalloon.module.scss';
import classNames from 'classnames';

type Props = {
	categoryName: string;
};

export const CompareTabHeadItem: FC<Props> = ({ categoryName }) => {
	return (
		<div className={classNames(styles.tabHeadItem, styles.on)}>
			<div className={styles.closeBtn}>닫기버튼</div>
			<p
				className={classNames(styles.name, styles.ndrBold, styles.ndrEllipsis)}
			>
				{categoryName}
			</p>
		</div>
	);
};
CompareTabHeadItem.displayName = 'CompareTabHeadItem';

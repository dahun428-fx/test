import { FC } from 'react';
import styles from '../CompareBalloon.module.scss';
import classNames from 'classnames';

type Props = {
	idx: number;
	activeTab: number;
	categoryName: string;
	onClick: (categoryCode: string) => void;
};

export const CompareTabHeadItem: FC<Props> = ({
	idx,
	activeTab,
	categoryName,
	onClick,
}) => {
	return (
		<div
			className={classNames(
				styles.tabHeadItem,
				idx === activeTab ? styles.on : ''
			)}
			onClick={() => onClick}
		>
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

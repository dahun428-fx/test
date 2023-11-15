import classNames from 'classnames';
import React, { memo, useCallback, MouseEvent } from 'react';
import styles from './Pager.module.scss';

type Props = {
	onClick: (prevOrNext: 'prev' | 'next') => void;
	className?: string;
};

export const Pager = memo<Props>(({ onClick, className }) => {
	const handleClickLeft = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClick('prev');
		},
		[onClick]
	);

	const handleClickRight = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClick('next');
		},
		[onClick]
	);

	return (
		<div className={classNames(className, styles.container)}>
			<a
				href=""
				className={styles.leftPager}
				onClick={handleClickLeft}
				aria-label="prev"
			/>
			<a
				href=""
				className={styles.rightPager}
				onClick={handleClickRight}
				aria-label="next"
			/>
		</div>
	);
});
Pager.displayName = 'Pager';

import classNames from 'classnames';
import React, { FC, MouseEvent } from 'react';
import styles from './Rating.module.scss';
import { StarRating } from './StarRating';

type Prop = {
	size?: 'm' | 'l';
	rate?: number;
	suffix?: React.ReactNode;
	className?: string;
	onClick?: (event: MouseEvent) => void;
};

/** Rating review component */
export const Rating: FC<Prop> = ({
	size = 'm',
	rate,
	suffix,
	className,
	onClick,
}) => {
	return (
		<div className={classNames(styles.container, className)}>
			<StarRating
				onClick={onClick}
				className={styles.star}
				rate={rate}
				size={size}
			/>
			{suffix}
		</div>
	);
};

Rating.displayName = 'Rating';

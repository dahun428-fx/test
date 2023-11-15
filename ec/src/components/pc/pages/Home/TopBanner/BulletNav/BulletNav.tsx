import React, { memo } from 'react';
import styles from './BulletNav.module.scss';
import { range } from '@/utils/number';

type Props = {
	cursor: number;
	bannerCount: number;
	onClick: (index: number) => void;
};

export const BulletNav = memo<Props>(({ bannerCount, cursor, onClick }) => {
	return (
		<ul className={styles.bulletNav}>
			{range(0, bannerCount).map(index => (
				<li key={index} className={styles.bulletItem}>
					<a
						className={styles.bullet}
						data-active={index === cursor}
						onClick={event => {
							event.preventDefault();
							onClick(index);
						}}
						aria-label={`Page-${index}`}
					/>
				</li>
			))}
		</ul>
	);
});
BulletNav.displayName = 'BulletNav';

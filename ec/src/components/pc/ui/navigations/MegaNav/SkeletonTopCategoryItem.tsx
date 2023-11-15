import React from 'react';
import styles from './SkeletonTopCategoryItem.module.scss';

/**
 * Skeleton top category list item
 */
export const SkeletonTopCategoryItem: React.VFC = () => {
	return (
		<li className={styles.skeletonWrapper}>
			<div className={styles.contents} />
		</li>
	);
};
SkeletonTopCategoryItem.displayName = 'SkeletonTopCategoryItem';

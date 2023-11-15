import Link from 'next/link';
import React from 'react';
import styles from './TopCategoryItem.module.scss';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';

type Props = {
	/** トップカテゴリ情報 */
	category: Category;
};

/**
 * トップカテゴリのリストアイテム
 */
export const TopCategoryItem: React.FC<Props> = ({ category }) => {
	return (
		<li className={styles.topCategoryItem}>
			<Link
				href={pagesPath.vona2._categoryCode([category.categoryCode]).$url()}
			>
				<a className={styles.categoryLink}>
					<div
						className={styles.categoryImage}
						style={{
							backgroundImage: `url(${category.categoryGroupImageUrl})`,
						}}
					/>
					<h4 className={styles.categoryTitle}>{category.categoryName}</h4>
				</a>
			</Link>
		</li>
	);
};
TopCategoryItem.displayName = 'TopCategoryItem';

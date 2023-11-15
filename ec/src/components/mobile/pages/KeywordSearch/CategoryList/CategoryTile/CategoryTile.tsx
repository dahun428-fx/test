import Link from 'next/link';
import React from 'react';
import styles from './CategoryTile.module.scss';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';

/**
 * Category tile
 */
export const CategoryTile: React.VFC<{
	category: Category;
	keyword: string;
}> = ({ category, keyword }) => {
	const href = url
		.category(...category.parentCategoryCodeList, category.categoryCode)
		.fromKeywordSearch(keyword);

	return (
		<Link href={href}>
			<a className={styles.tile}>
				<div className={styles.imageWrapper}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={category.categoryImageUrl}
						alt={category.categoryName}
						className={styles.image}
						loading="lazy"
					/>
				</div>
				<div className={styles.categoryName}>{category.categoryName}</div>
			</a>
		</Link>
	);
};
CategoryTile.displayName = 'CategoryTile';

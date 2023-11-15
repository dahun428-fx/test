import React from 'react';
import { CategoryTopSectionListItem } from './CategoryTopSectionListItem';
import styles from './TopCategory.module.scss';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

export type Props = {
	category: Category;
	brand?: Brand;
};

/** Top category component */
export const TopCategory: React.VFC<Props> = ({ category, brand }) => {
	return (
		<>
			{!brand && (
				<>
					<h1 className={styles.title}>{category.categoryName}</h1>
				</>
			)}
			<div className={styles.categoryListContainer}>
				{category.childCategoryList.map(category => {
					return (
						<CategoryTopSectionListItem
							key={category.categoryCode}
							category={category}
							brand={brand}
						/>
					);
				})}
			</div>
		</>
	);
};
TopCategory.displayName = 'TopCategory';

import React from 'react';
import styles from './CategoryInfo.module.scss';
import { Meta } from './Meta';
import { CategoryList } from '@/components/pc/domain/category/CategoryList';
import { CategoryDescription } from '@/components/pc/pages/Category/CategoryDescription';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

export type Props = {
	category: Category;
	categoryList: Category[];
	topCategoryCode: string;
};

/** Category info component */
export const CategoryInfo: React.VFC<Props> = ({
	category,
	categoryList,
	topCategoryCode,
}) => {
	return (
		<>
			<Meta
				category={category}
				categoryList={categoryList}
				topCategoryCode={topCategoryCode}
			/>
			<div>
				<h1 className={styles.title}>{category.categoryName}</h1>
				{category.categoryDetail && (
					<CategoryDescription categoryDetail={category.categoryDetail} />
				)}
				<CategoryList categoryList={category.childCategoryList} />
			</div>
		</>
	);
};
CategoryInfo.displayName = 'CategoryInfo';

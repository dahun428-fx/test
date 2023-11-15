import { memo } from 'react';
import styles from './CategoryGroup.module.scss';
import { CategoryGroupItem } from './CategoryGroupItem';
import { getId } from '@/components/mobile/pages/Category/CategoryList/SecondaryCategoryGroups';
import type { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	category?: Category;
	onClickTertiary?: (categoryCode: string) => void;
};

export const CategoryGroup = memo<Props>(({ category, onClickTertiary }) => {
	if (!category) {
		return null;
	}
	return (
		<li className={styles.category}>
			<div id={getId(category)} />
			{category.categoryName}
			<ul className={styles.list}>
				{category.childCategoryList.length > 0 ? (
					category.childCategoryList.map(child => (
						<li key={child.categoryCode} className={styles.item}>
							<CategoryGroupItem
								category={child}
								onClick={() => onClickTertiary?.(child.categoryCode)}
							/>
						</li>
					))
				) : (
					// Cases without child category
					<li className={styles.item}>
						<CategoryGroupItem category={category} />
					</li>
				)}
			</ul>
		</li>
	);
});
CategoryGroup.displayName = 'CategoryGroup';

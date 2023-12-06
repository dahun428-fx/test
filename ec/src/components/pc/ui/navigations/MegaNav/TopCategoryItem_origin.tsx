import React from 'react';
import { CategoryBalloon } from './CategoryBalloon';
import { Link } from './Link';
import styles from './TopCategoryItem.module.scss';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';

type Props = {
	/** トップカテゴリ情報 */
	category: Category;
	/** click category link handler */
	onClickLink: () => void;
};

/**
 * トップカテゴリのリストアイテム
 */
export const TopCategoryItem: React.FC<Props> = ({ category, onClickLink }) => {
	return (
		<li className={styles.topCategoryItem}>
			<Link href={url.category(category.categoryCode)()} onClick={onClickLink}>
				{category.categoryName}
			</Link>
			<CategoryBalloon
				className={styles.balloon}
				categoryCode={category.categoryCode}
				categoryGroupImageUrl={category.categoryGroupImageUrl}
				categoryName={category.categoryName}
				childCategoryList={category.childCategoryList}
				onClickLink={onClickLink}
			/>
		</li>
	);
};
TopCategoryItem.displayName = 'TopCategoryItem';

import { useCallback, useRef } from 'react';
import styles from './CategoryTopSectionListItem.module.scss';
import { ITEM_WIDTH } from '@/components/pc/domain/category/CategoryItem';
import { CategoryList } from '@/components/pc/domain/category/CategoryList';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	category: Category;
	brand?: Brand;
};

/** Category top section list item */
export const CategoryTopSectionListItem: React.VFC<Props> = ({
	category,
	brand,
}) => {
	const titleRef = useRef<HTMLElement | null>(null);
	const categoryListRef = useRef<HTMLDivElement | null>(null);

	const childCategoryList = category.childCategoryList.length
		? category.childCategoryList
		: [category];

	const calculateMinWidth = useCallback(() => {
		if (!titleRef.current || !categoryListRef.current) {
			return;
		}

		const titleWidth = titleRef.current.offsetWidth;
		const mergedWidth = (Math.ceil(titleWidth / ITEM_WIDTH) + 1) * ITEM_WIDTH;
		const maxFlag = mergedWidth > 750;

		if (!maxFlag) {
			titleRef.current.style.minWidth = `${mergedWidth}px`;
			categoryListRef.current.style.minWidth = `${mergedWidth}px`;
		}
	}, []);

	useOnMounted(calculateMinWidth);

	return (
		<div
			className={styles.categoryListWrapper}
			key={category.categoryCode}
			id={category.categoryCode}
		>
			<h3 className={styles.titleWrapper}>
				<span ref={titleRef} className={styles.title}>
					{category.categoryName}
				</span>
			</h3>
			<div className={styles.categoryList} ref={categoryListRef}>
				<CategoryList categoryList={childCategoryList} brand={brand} />
			</div>
		</div>
	);
};
CategoryTopSectionListItem.displayName = 'CategoryTopSectionListItem';

import { VFC, useRef } from 'react';
import styles from './CategoryBrandRanking.module.scss';
import { CategoryBrandRankingItem } from './CategoryBrandRankingItem';
import { CrmPagination } from '@/components/pc/domain/category/CrmPagination';
import { usePage } from '@/hooks/state/usePage';
import { GetCategoryBrandRankingResponse } from '@/models/api/cameleer/getCategoryBrandRanking/GetCategoryBrandRankingResponse';

type Props = {
	categoryBrandRanking?: GetCategoryBrandRankingResponse;
};

/** Category brand ranking component */
export const CategoryBrandRanking: VFC<Props> = ({ categoryBrandRanking }) => {
	const innerListRef = useRef<HTMLUListElement>(null);
	const ITEM_WIDTH = 214;

	// 5件づつ表示（en: Display 5 items at a time）
	const CATEGORY_BRAND_PAGE_SIZE = 5;
	const {
		listPerPage: currentPageCategoryBrandList,
		setPageSize,
		goToNext,
		backToPrev,
		page,
		pageSize,
	} = usePage({
		initialPageSize: CATEGORY_BRAND_PAGE_SIZE,
		list: categoryBrandRanking?.recommendItems || [],
	});

	if (!categoryBrandRanking || !categoryBrandRanking.recommendItems.length) {
		return null;
	}

	const { title, recommendItems } = categoryBrandRanking;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>{title}</h2>
			<CrmPagination
				itemWidth={ITEM_WIDTH}
				totalItems={recommendItems.length}
				{...{ page, pageSize, setPageSize, goToNext, backToPrev }}
			>
				{currentPageCategoryBrandList.map((recommend, index) => {
					return (
						<CategoryBrandRankingItem
							key={index}
							categoryBrandRankingItem={recommend}
							itemWidth={ITEM_WIDTH}
							innerListRef={innerListRef}
						/>
					);
				})}
			</CrmPagination>
		</div>
	);
};
CategoryBrandRanking.displayName = 'CategoryBrandRanking';

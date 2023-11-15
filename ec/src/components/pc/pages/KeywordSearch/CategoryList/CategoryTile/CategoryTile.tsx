import React, { useCallback } from 'react';
import styles from './CategoryTile.module.scss';
import { Link } from '@/components/pc/ui/links';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchType } from '@/models/api/msm/ect/log/message';
import { url } from '@/utils/url';

export const CategoryTile: React.VFC<{
	category: Category;
	keyword: string;
	index: number;
	isReSearch?: string;
}> = ({ category, keyword, index, isReSearch }) => {
	const href = url
		.category(...category.parentCategoryCodeList, category.categoryCode)
		.fromKeywordSearch(keyword);

	const handleClick = useCallback(() => {
		ectLogger.search.clickSuggest({
			forwardPageUrl: href,
			keyword,
			index,
			searchType: SearchType.KEYWORD_SEARCH,
			searchResultType: 'LinkCtg',
			suggestion: '',
			selectedKeywordDispNo: undefined,
			reSearchFlag:
				isReSearch && Flag.isFlag(isReSearch) ? isReSearch : Flag.FALSE,
			href,
		});
	}, [href, index, isReSearch, keyword]);

	return (
		<Link href={href} newTab onClick={handleClick} className={styles.tile}>
			<div className={styles.imageWrapper}>
				<img // eslint-disable-line @next/next/no-img-element
					src={category.categoryImageUrl}
					alt={category.categoryName}
					className={styles.image}
				/>
			</div>
			<div className={styles.categoryName}>{category.categoryName}</div>
		</Link>
	);
};
CategoryTile.displayName = 'CategoryTile';

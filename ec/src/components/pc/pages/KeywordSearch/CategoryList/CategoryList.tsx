import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryList.module.scss';
import { CategoryTile } from './CategoryTile';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { Pagination } from '@/components/pc/ui/paginations';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getOneParams } from '@/utils/query';

type Props = {
	className?: string;
	keyword: string;
	response: SearchCategoryResponse;
	page: number;
	onChangePage: (page: number) => void;
};

const PAGE_SIZE = 11;

/**
 * Category list
 */
export const CategoryList: React.VFC<Props> = ({
	className,
	response,
	keyword,
	page,
	onChangePage,
}) => {
	const { t } = useTranslation();
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	return (
		<Section
			id="categoryList"
			className={className}
			title={t('pages.keywordSearch.categoryList.heading', {
				totalCount: response.totalCount,
			})}
		>
			<div className={styles.paginationWrap}>
				<Pagination
					page={page}
					pageSize={PAGE_SIZE}
					totalCount={response.totalCount}
					onChange={onChangePage}
				/>
			</div>
			<ul className={styles.list}>
				{response.categoryList.map((category, index) => (
					<li key={category.categoryCode}>
						<CategoryTile
							category={category}
							index={index}
							keyword={keyword}
							isReSearch={isReSearch}
						/>
					</li>
				))}
			</ul>
		</Section>
	);
};
CategoryList.displayName = 'CategoryList';

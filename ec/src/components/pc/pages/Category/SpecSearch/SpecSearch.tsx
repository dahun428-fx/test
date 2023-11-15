import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SpecSearch.module.scss';
import { CategoryList } from '@/components/pc/domain/category/CategoryList';
import { CategoryDescription } from '@/components/pc/pages/Category/CategoryDescription';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import {
	formatCategorySpec,
	getCategorySpecFromQuery,
} from '@/utils/domain/category';
import { getSeriesCount } from '@/utils/domain/series';
import { notEmpty } from '@/utils/predicate';

type Props = {
	category: Category;
	seriesResponse: SearchSeriesResponse$search;
	categorySpecQuery: string | undefined;
	page: number;
};

/** Spec Search */
export const SpecSearch: React.VFC<Props> = ({
	category,
	seriesResponse,
	categorySpecQuery,
	page,
}) => {
	const [t] = useTranslation();

	const categoryList = category.childCategoryList.filter(category => {
		const seriesCount = getSeriesCount(
			category.categoryCode,
			seriesResponse.categoryList
		);
		return seriesCount && seriesCount > 0;
	});

	const categoryName = useMemo(() => {
		let categorySpec = '';
		let pageText = '';
		if (categorySpecQuery) {
			const categorySpecFromQuery = getCategorySpecFromQuery(
				categorySpecQuery,
				seriesResponse
			);
			categorySpec = formatCategorySpec(categorySpecFromQuery);
		}

		if (page > 1) {
			pageText = t('pages.category.titlePage', {
				page,
			});
		}

		const specAndPage = [categorySpec, pageText].filter(notEmpty).join(' ');

		if (!specAndPage) {
			return category.categoryName;
		}
		return `${category.categoryName} (${specAndPage})`;
	}, [category.categoryName, categorySpecQuery, page, seriesResponse, t]);

	return (
		<div>
			<h1 className={styles.title}>{categoryName}</h1>
			{category.categoryDetail && (
				<CategoryDescription categoryDetail={category.categoryDetail} />
			)}
			<CategoryList
				categoryList={categoryList}
				seriesCategories={seriesResponse.categoryList}
			/>
		</div>
	);
};
SpecSearch.displayName = 'SpecSearch';

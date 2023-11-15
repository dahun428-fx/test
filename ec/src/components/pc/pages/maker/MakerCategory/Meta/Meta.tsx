import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { selectCategoryResponse } from '@/store/modules/pages/category';
import { last } from '@/utils/collection';
import { getCategoryListFromRoot } from '@/utils/domain/category';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { removeTags } from '@/utils/string';
import { url } from '@/utils/url';

type Props = {
	category: Category;
	brand: Brand;
};

/** Maker category meta component */
export const Meta: VFC<Props> = ({ category, brand }) => {
	const { brandName } = brand;
	const { categoryName, departmentCode, parentCategoryCodeList } = category;
	const { t } = useTranslation();
	const rootCategory = useSelector(selectCategoryResponse);

	const categoryRouteForKeywords = useMemo(() => {
		if (!rootCategory || !rootCategory.categoryList.length) {
			return [];
		}

		const lastCategory = last(rootCategory.categoryList);
		const lastParentCode = last(parentCategoryCodeList);
		if (!lastCategory || !lastParentCode) {
			return [];
		}

		const categoryTree = getCategoryListFromRoot(lastCategory, lastParentCode);
		return categoryTree
			.slice(1)
			.reverse()
			.map(category => category.categoryName)
			.join(',');
	}, [parentCategoryCodeList, rootCategory]);

	const keywords = useMemo(() => {
		return t('pages.maker.makerCategory.meta.keywords', {
			brandName,
			categoryName,
			categoryRouteForKeywords,
			seoKeywords: getDepartmentKeywords(departmentCode, t),
		});
	}, [brandName, categoryName, categoryRouteForKeywords, departmentCode, t]);

	return (
		<Head>
			<title>
				{removeTags(
					t('pages.maker.makerCategory.meta.title', {
						categoryName,
						brandName,
					})
				)}
			</title>
			<meta
				name="description"
				content={removeTags(
					t('pages.maker.makerCategory.meta.description', {
						categoryName,
						brandName,
					})
				)}
			/>
			{keywords && <meta name="keywords" content={removeTags(keywords)} />}
			<meta name="format-detection" content="telephone=no" />
			<link
				rel="canonical"
				href={`${url
					.brand(brand)
					.category(
						...category.parentCategoryCodeList,
						category.categoryCode
					)}/`}
			/>
		</Head>
	);
};
Meta.displayName = 'Meta';

import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { removeTags } from '@/utils/string';
import { url } from '@/utils/url';

type Props = {
	category: Category;
	brand: Brand;
};

/** Maker category top meta component */
export const Meta: VFC<Props> = ({ category, brand }) => {
	const { brandName } = brand;
	const { categoryName, departmentCode } = category;
	const [t] = useTranslation();

	const keywords = useMemo(() => {
		return t('pages.maker.makerCategoryTop.meta.keywords', {
			brandName,
			seoKeywords: getDepartmentKeywords(departmentCode, t),
		});
	}, [brandName, departmentCode, t]);

	return (
		<Head>
			<title>
				{removeTags(
					t('pages.maker.makerCategoryTop.meta.title', {
						categoryName,
						brandName,
					})
				)}
			</title>
			<meta
				name="description"
				content={removeTags(
					t('pages.maker.makerCategoryTop.meta.description', {
						categoryName,
						brandName,
					})
				)}
			/>
			{keywords && <meta name="keywords" content={removeTags(keywords)} />}
			<meta name="format-detection" content="telephone=no" />
			<link
				rel="canonical"
				href={`${url.brand(brand).category(category.categoryCode)}/`}
			/>
		</Head>
	);
};
Meta.displayName = 'Meta';

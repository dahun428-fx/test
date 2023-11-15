import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { url } from '@/utils/url';

type Props = {
	category: Category;
};

/** Maker category top meta component */
export const Meta: VFC<Props> = ({ category }) => {
	const { categoryName, departmentCode } = category;
	const { t } = useTranslation();

	const keywords = useMemo(() => {
		return getDepartmentKeywords(departmentCode, t);
	}, [departmentCode, t]);

	return (
		<Head>
			<title>
				{t('pages.category.categoryTop.meta.title', { categoryName })}
			</title>
			<meta
				name="description"
				content={t('pages.category.categoryTop.meta.description', {
					categoryName,
				})}
			/>
			{keywords && <meta name="keywords" content={`${keywords}`} />}
			<meta name="format-detection" content="telephone=no" />
			<link rel="canonical" href={url.category(category.categoryCode)()} />
		</Head>
	);
};
Meta.displayName = 'Meta';

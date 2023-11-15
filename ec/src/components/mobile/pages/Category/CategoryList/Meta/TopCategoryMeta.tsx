import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { url } from '@/utils/url';

type Props = {
	category: Category;
};

export const TopCategoryMeta: VFC<Props> = ({ category }) => {
	const { categoryName, departmentCode } = category;
	const { t } = useTranslation();

	const keywords = useMemo(() => {
		return getDepartmentKeywords(departmentCode, t);
	}, [departmentCode, t]);

	return (
		<Head>
			<title>
				{t('mobile.pages.category.categoryList.meta.title', { categoryName })}
			</title>
			<meta
				name="description"
				content={t('mobile.pages.category.categoryList.meta.description', {
					categoryName,
				})}
			/>
			{keywords && <meta name="keywords" content={`${keywords}`} />}
			<link rel="canonical" href={url.category(category.categoryCode)()} />
		</Head>
	);
};

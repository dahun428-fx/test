import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { url } from '@/utils/url';

type Props = {
	flattenCategoryList: Category[];
};

export const LowerCategoryMeta: VFC<Props> = ({ flattenCategoryList }) => {
	const category = last(flattenCategoryList);
	assertNotNull(category);
	const { categoryName, departmentCode } = category;
	const { t } = useTranslation();

	const categoryCodeList = useMemo(() => {
		return flattenCategoryList.map(category => category.categoryCode);
	}, [flattenCategoryList]);

	/** TOP カテゴリを除くカテゴリ名の逆順リスト */
	const categoryNameList = useMemo(() => {
		return flattenCategoryList
			.map(category => category.categoryName)
			.slice(1)
			.reverse()
			.join();
	}, [flattenCategoryList]);

	return (
		<Head>
			<title>
				{t('mobile.pages.category.categoryList.meta.title', {
					categoryName,
				})}
			</title>
			<meta
				name="description"
				content={t('mobile.pages.category.categoryList.meta.description', {
					categoryName,
				})}
			/>
			<meta
				name="keywords"
				content={t('mobile.pages.category.categoryList.meta.keywords', {
					categoryNameList,
					seoKeywords: getDepartmentKeywords(departmentCode, t),
				})}
			/>
			<link rel="canonical" href={url.category(...categoryCodeList)()} />
		</Head>
	);
};

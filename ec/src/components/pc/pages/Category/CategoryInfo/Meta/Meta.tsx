import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import {
	departmentKeywords,
	getCategoryListFromRoot,
} from '@/utils/domain/category';
import { url } from '@/utils/url';

type Props = {
	category: Category;
	categoryList: Category[];
	topCategoryCode: string;
};

export const Meta: VFC<Props> = ({
	category,
	categoryList,
	topCategoryCode,
}) => {
	const { categoryName, departmentCode } = category;
	const { t } = useTranslation();

	/** TOP カテゴリを除くカテゴリ名の逆順リスト */
	const categoryNameList = useMemo(() => {
		const topCategory = categoryList.find(
			category => category.categoryCode === topCategoryCode
		);
		if (!topCategory) {
			return category.categoryName;
		}

		return getCategoryListFromRoot(topCategory, category.categoryCode)
			.map(category => category.categoryName)
			.slice(1)
			.reverse()
			.join();
	}, [
		category.categoryCode,
		category.categoryName,
		categoryList,
		topCategoryCode,
	]);

	const keywords = useMemo(() => {
		return t('pages.category.categoryInfo.meta.keywords', {
			categoryNameList,
			seoKeywords: departmentKeywords(departmentCode, t),
		});
	}, [categoryNameList, departmentCode, t]);

	return (
		<Head>
			<title>
				{t('pages.category.categoryInfo.meta.title', {
					categoryName,
				})}
			</title>
			<meta
				name="description"
				content={t('pages.category.categoryInfo.meta.description', {
					categoryName,
				})}
			/>
			<meta name="keywords" content={keywords} />
			<meta name="format-detection" content="telephone=no" />
			<link
				rel="canonical"
				href={url.category(
					...category.parentCategoryCodeList,
					category.categoryCode
				)()}
			/>
		</Head>
	);
};
Meta.displayName = 'Meta';

import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { removeTags } from '@/utils/string';
import { url } from '@/utils/url';

type Props = {
	brand: Brand;
	category?: Category;
};

/** Maker list meta component */
export const Meta: VFC<Props> = ({ brand, category }) => {
	const { t } = useTranslation();
	const { brandName } = brand;

	const keywords = useMemo(() => {
		if (!category) {
			return null;
		}

		return t('pages.maker.makerTop.meta.keywords', {
			brandName,
			seoKeywords: getDepartmentKeywords(category.departmentCode, t),
		});
	}, [brandName, category, t]);

	return (
		<Head>
			<title>
				{removeTags(t('pages.maker.makerTop.meta.title', { brandName }))}
			</title>
			<meta
				name="description"
				content={removeTags(
					t('pages.maker.makerTop.meta.description', { brandName })
				)}
			/>
			{keywords && <meta name="keywords" content={removeTags(keywords)} />}
			<meta name="format-detection" content="telephone=no" />
			<link rel="canonical" href={url.brand(brand).default} />
		</Head>
	);
};
Meta.displayName = 'Meta';

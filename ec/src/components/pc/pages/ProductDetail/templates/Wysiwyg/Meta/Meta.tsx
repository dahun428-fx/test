import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { pagesPath } from '@/utils/$path';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { removeTags } from '@/utils/string';
import { convertToURLString } from '@/utils/url';

type Props = {
	series: Series;
	translatedTab?: string;
};

export const Meta: VFC<Props> = ({ series, translatedTab }) => {
	const {
		seriesName,
		brandName,
		seriesCode,
		categoryList,
		categoryName,
		departmentCode,
	} = series;

	const { t } = useTranslation();

	const title = useMemo(() => {
		return t('pages.productDetail.wysiwyg.meta.title.default', {
			seriesName: removeTags(seriesName),
			brandName: removeTags(brandName),
			formattedTab: !!translatedTab
				? t('pages.productDetail.wysiwyg.meta.title.formatTab', {
						tab: translatedTab,
				  })
				: '',
		});
	}, [brandName, seriesName, t, translatedTab]);

	const description = useMemo(() => {
		return t('pages.productDetail.wysiwyg.meta.description.default', {
			seriesName: removeTags(seriesName),
			brandName: removeTags(brandName),
			formattedTab: !!translatedTab
				? t('pages.productDetail.wysiwyg.meta.description.formatTab', {
						tab: translatedTab,
				  })
				: '',
		});
	}, [brandName, seriesName, t, translatedTab]);

	const keywords = useMemo(
		() =>
			t('pages.productDetail.wysiwyg.meta.keywords', {
				seriesName: removeTags(seriesName),
				brandName: removeTags(brandName),
				categoryNames: removeTags(
					categoryList
						.map(category => category.categoryName)
						.concat(categoryName || [])
						.reverse()
						.join(',')
				),
				seoKeywords: getDepartmentKeywords(departmentCode, t),
			}),
		[t, seriesName, brandName, categoryList, categoryName, departmentCode]
	);

	const canonicalURL = useMemo(() => {
		return pagesPath.vona2.detail._seriesCode(seriesCode).$url();
	}, [seriesCode]);

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<link rel="canonical" href={convertToURLString(canonicalURL)} />
			<meta name="format-detection" content="telephone=no" />
		</Head>
	);
};
Meta.displayName = 'Meta';

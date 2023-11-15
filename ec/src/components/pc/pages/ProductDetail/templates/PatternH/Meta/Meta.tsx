import Head from 'next/head';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { pagesPath } from '@/utils/$path';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { removeTags } from '@/utils/string';
import { convertToURLString } from '@/utils/url';

type Props = {
	seriesName: string;
	brandName: string;
	seriesCode: string;
	departmentCode: string;
};
export const Meta: VFC<Props> = ({
	seriesName,
	brandName,
	seriesCode,
	departmentCode,
}) => {
	const { t } = useTranslation();

	const title = useMemo(() => {
		return t('pages.productDetail.patternH.meta.title', {
			seriesName: removeTags(seriesName),
			brandName: removeTags(brandName),
		});
	}, [brandName, seriesName, t]);

	const description = useMemo(() => {
		return t('pages.productDetail.patternH.meta.description', {
			seriesName: removeTags(seriesName),
			brandName: removeTags(brandName),
		});
	}, [brandName, seriesName, t]);

	const keywords = useMemo(
		() =>
			t('pages.productDetail.patternH.meta.keywords', {
				seriesName: removeTags(seriesName),
				brandName: removeTags(brandName),
				seoKeywords: getDepartmentKeywords(departmentCode, t),
			}),
		[seriesName, brandName, departmentCode, t]
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

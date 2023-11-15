import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs as Presenter } from '@/components/pc/ui/links/Breadcrumbs';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const Breadcrumbs: React.VFC = () => {
	const [t] = useTranslation();
	const series = useSelector(selectSeries);

	const breadcrumbList = useMemo(() => {
		const { seriesName } = series;

		return [
			{
				text: t('pages.productDetail.patternH.breadcrumbs.webOnlyProducts'),
				strong: true,
			},
			{ text: seriesName },
		];
	}, [series, t]);

	return <Presenter displayMode="html" breadcrumbList={breadcrumbList} />;
};
Breadcrumbs.displayName = 'Breadcrumbs';

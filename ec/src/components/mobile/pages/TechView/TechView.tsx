import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Meta } from './Meta';
import { TechnicalInformation } from './TechnicalInformation';
import { BreadcrumbsPortal } from '@/components/mobile/layouts/footers/Footer/BreadcrumbsPortal';
import { Breadcrumb } from '@/components/mobile/ui/links/Breadcrumbs';

type Props = {
	keyword: string;
};

/** Tech view */
export const TechView: VFC<Props> = ({ keyword }) => {
	const [t] = useTranslation();

	const breadcrumbList: Breadcrumb[] = [
		{
			text: t('mobile.pages.techView.searchResults'),
		},
		{
			text: t('mobile.pages.techView.searchForTechnicalInformation'),
		},
	];

	return (
		<>
			<Meta keyword={keyword} />
			<TechnicalInformation keywordFromUrl={keyword} />
			<BreadcrumbsPortal breadcrumbList={breadcrumbList} />
		</>
	);
};

TechView.displayName = 'TechView';

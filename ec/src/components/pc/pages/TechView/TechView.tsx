import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Meta } from './Meta';
import styles from './TechView.module.scss';
import { TechnicalInformation } from './TechnicalInformation';
import { Breadcrumbs, Breadcrumb } from '@/components/pc/ui/links/Breadcrumbs';

type Props = {
	keyword: string;
};

/** Tech view */
export const TechView: VFC<Props> = ({ keyword }) => {
	const [t] = useTranslation();

	const breadcrumbs: Breadcrumb[] = [
		{
			text: t('pages.techView.searchResults'),
			strong: true,
		},
		{
			text: t('pages.techView.searchForTechnicalInformation'),
		},
	];

	return (
		<div className={styles.page}>
			<Meta keyword={keyword} />
			<div className={styles.breadcrumbWrapper}>
				<Breadcrumbs breadcrumbList={breadcrumbs} />
			</div>
			<div className={styles.technicalInformationWrapper}>
				<TechnicalInformation keywordFromUrl={keyword} />
			</div>
		</div>
	);
};

TechView.displayName = 'TechView';

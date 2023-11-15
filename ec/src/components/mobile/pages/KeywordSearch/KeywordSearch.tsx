import React from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryList } from './CategoryList';
import { ComboList } from './ComboList';
import { FullTextSearch } from './FullTextSearch';
import styles from './KeywordSearch.module.scss';
import { KeywordSearchMeta } from './KeywordSearchMeta';
import { NoResult } from './NoResult';
import { PartNumberTypeList } from './PartNumberTypeList';
import { SeriesList } from './SeriesList';
import { TechnicalInformation } from './TechnicalInformation';
import { UnitLibrary } from './UnitLibrary';
import { BreadcrumbsPortal } from '@/components/mobile/layouts/footers/Footer/BreadcrumbsPortal';
import { SeriesListControl } from '@/components/mobile/pages/KeywordSearch/SeriesListControl';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { Breadcrumb } from '@/components/mobile/ui/links/Breadcrumbs';
import { PageLoader } from '@/components/mobile/ui/loaders';
import { Status } from '@/store/modules/pages/keywordSearch';

export type Props = {
	keyword: string;
	status: Status;
	displayType: DisplayTypeOption;
	totalCount?: number;
	seriesPage?: number;
	onChangeDisplayType: (value: DisplayTypeOption) => void;
};

/**
 * Keyword Search.
 * @param keyword
 */
export const KeywordSearch: React.VFC<Props> = ({
	keyword,
	status,
	displayType,
	totalCount,
	seriesPage,
	onChangeDisplayType,
}) => {
	const { t } = useTranslation();

	const breadcrumbList: Breadcrumb[] = [
		{
			text: t('mobile.pages.keywordSearch.breadcrumbText'),
		},
	];

	return (
		<div className={styles.main}>
			<KeywordSearchMeta keyword={keyword} seriesPage={seriesPage} />
			{status < Status.READY ? (
				<PageLoader />
			) : (
				<>
					<NoResult />
					<CategoryList keyword={keyword} />
					<SeriesListControl
						displayType={displayType}
						totalResult={totalCount}
						onChangeDisplayType={onChangeDisplayType}
					/>
					<PartNumberTypeList keyword={keyword} displayType={displayType} />

					<SeriesList
						keyword={keyword}
						displayType={displayType}
						seriesPage={seriesPage}
					/>

					<UnitLibrary keyword={keyword} />
					<FullTextSearch keyword={keyword} />
					<TechnicalInformation keyword={keyword} />
					<ComboList keyword={keyword} />
					<BreadcrumbsPortal breadcrumbList={breadcrumbList} />
				</>
			)}
		</div>
	);
};
KeywordSearch.displayName = 'KeywordSearch';

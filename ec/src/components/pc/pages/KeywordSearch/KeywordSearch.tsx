import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandList } from './BrandList';
import { CategoryList } from './CategoryList';
import { ComboList } from './ComboList';
import { FullTextSearch } from './FullTextSearch';
import { KeywordBanner } from './KeywordBanner';
import { useLoadKeywordRelated, useTrackPageView } from './KeywordSearch.hooks';
import styles from './KeywordSearch.module.scss';
import { KeywordSearchMeta } from './KeywordSearchMeta';
import { NoResult } from './NoResult';
import { PartNumberTypeList } from './PartNumberTypeList';
import { RelatedKeywordList } from './RelatedKeywordList';
import { SeriesList } from './SeriesList';
import { TechnicalInformation } from './TechnicalInformation';
import { UnitLibrary } from './UnitLibrary';
import { SearchResultRecommend } from '@/components/pc/domain/category/CameleerContents/SearchResultRecommend';
import { Breadcrumbs, Breadcrumb } from '@/components/pc/ui/links/Breadcrumbs';
import { PageLoader } from '@/components/pc/ui/loaders';
import { Status } from '@/store/modules/pages/keywordSearch';

export type Props = {
	keyword: string;
	categoryPage?: number;
	seriesPage?: number;
};

/**
 * Keyword Search.
 */
export const KeywordSearch: React.VFC<Props> = props => {
	const { t } = useTranslation();

	const breadcrumbList: Breadcrumb[] = useMemo(
		() => [
			{
				text: t('pages.keywordSearch.breadcrumbText', {
					keyword: props.keyword,
				}),
			},
		],
		[props.keyword, t]
	);

	const { status } = useLoadKeywordRelated(props);
	useTrackPageView(props.keyword);

	return (
		<div className={styles.main}>
			<KeywordSearchMeta
				keyword={props.keyword}
				seriesPage={props.seriesPage}
			/>
			<div className={styles.breadcrumbs}>
				<Breadcrumbs breadcrumbList={breadcrumbList} />
			</div>
			{status < Status.LOADED_MAIN ? (
				<PageLoader />
			) : (
				<div>
					<NoResult />
					<RelatedKeywordList className={styles.section} />
					<KeywordBanner className={styles.section} />
					<PartNumberTypeList
						keyword={props.keyword}
						className={styles.section}
					/>
					<CategoryList
						categoryPage={props.categoryPage}
						keyword={props.keyword}
						className={styles.section}
					/>
					<SeriesList
						keyword={props.keyword}
						seriesPage={props.seriesPage}
						className={styles.section}
					/>
					<BrandList keyword={props.keyword} className={styles.section} />
					<ComboList keyword={props.keyword} className={styles.section} />
					<UnitLibrary keyword={props.keyword} className={styles.section} />
					<FullTextSearch keyword={props.keyword} className={styles.section} />
					<TechnicalInformation
						keyword={props.keyword}
						className={styles.section}
					/>
					<SearchResultRecommend />
				</div>
			)}
		</div>
	);
};
KeywordSearch.displayName = 'KeywordSearch';

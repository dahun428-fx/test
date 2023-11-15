import dynamic from 'next/dynamic';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AttentionMessage } from './AttentionMessage';
import { useTrackPageView } from './Home.hooks';
import styles from './Home.module.scss';
import { MegaNavMenu } from './MegaNavMenu';
import { NewsArea } from './NewsArea';
import { TopBanner } from './TopBanner';
import HeadTitle from '@/components/mobile/head/HeadTitle';
import MetaTags from '@/components/mobile/head/MetaTags';
import { AboutMisumi } from '@/components/mobile/pages/Home/AboutMisumi';
import { config } from '@/config';
import { MaintenanceMessage } from '@/models/api/cms/home/GetAttentionsResponse';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

export type Props = {
	bannerList: Banner[];
	maintenanceMessageList: MaintenanceMessage[];
	newsArticleList: NewsArticle[];
	topCategoryList: Category[];
};

// eslint-disable-next-line @typescript-eslint/ban-types
const PersonalContents = dynamic<{}>(
	import('./PersonalContents').then(modules => modules.PersonalContents),
	{ ssr: false, loading: () => <AboutMisumi /> }
);

// eslint-disable-next-line @typescript-eslint/ban-types
const FeaturedContents = dynamic<{}>(
	import('./FeaturedContents').then(modules => modules.FeaturedContents),
	{ ssr: false }
);

// eslint-disable-next-line @typescript-eslint/ban-types
const PopularBrand = dynamic<{}>(
	import('./PopularBrand').then(modules => modules.PopularBrand),
	{ ssr: false }
);

/**
 * Home page component
 */
export const Home: React.VFC<Props> = ({
	bannerList = [],
	newsArticleList,
	maintenanceMessageList = [],
	topCategoryList = [],
}) => {
	const { t } = useTranslation();
	useTrackPageView();

	return (
		<div className={styles.container}>
			{/* NOTE: Head Title maybe share between PC and Mobile, need to discuss with HAYABUSA team */}
			<HeadTitle title={t('mobile.pages.home.pageTitle')} noSuffix />
			<MetaTags
				keywords={t('mobile.pages.home.meta.keywords')}
				description={t('mobile.pages.home.meta.description')}
				canonicalUrl={`${config.web.ec.origin}/`}
			/>
			<AttentionMessage maintenanceMessageList={maintenanceMessageList} />
			<TopBanner bannerList={bannerList} />
			<MegaNavMenu categoryList={topCategoryList} />

			<div className={styles.personalContents}>
				<PersonalContents />
			</div>

			<FeaturedContents />
			<PopularBrand />
			<NewsArea newsArticleList={newsArticleList} />
		</div>
	);
};

Home.displayName = 'Home';

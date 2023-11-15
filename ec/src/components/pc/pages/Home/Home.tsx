import classNames from 'classnames';
import React from 'react';
import { AttentionMessage } from './AttentionMessage';
import { PurchaseSeriesRepeatRecommend } from './CameleerContents/PurchaseSeriesRepeatRecommend';
import { RadarChartRecommend } from './CameleerContents/RadarChartRecommend';
import { ViewHistorySimulPurchase } from './CameleerContents/ViewHistorySimulPurchase';
import { FeaturedContents } from './FeaturedContents';
import styles from './Home.module.scss';
import { MiniBanners } from './Home.types';
import { MainPanel } from './MainPanel';
import { MiniBanner } from './MiniBanner';
import { News } from './News';
import { TopAside } from './TopAside';
import { TopBanner } from './TopBanner';
import { ViewHistory } from '@/components/pc/pages/Home/CameleerContents/ViewHistory';
import { Meta } from '@/components/pc/pages/Home/Meta';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { MaintenanceMessage } from '@/models/api/cms/home/GetAttentionsResponse';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';

type Props = {
	bannerList: Banner[];
	maintenanceMessageList: MaintenanceMessage[];
	miniBanners: MiniBanners;
	newsArticleList: NewsArticle[];
	className?: string;
};

export const Home: React.VFC<Props> = ({
	bannerList = [],
	maintenanceMessageList,
	miniBanners,
	className,
	newsArticleList,
}) => {
	useOnMounted(() => {
		ectLogger.visit({ classCode: ClassCode.TOP });
		aa.pageView.top().then();
		ga.pageView.top().then();
	});

	return (
		<div className={classNames(styles.main, className)}>
			<Meta />
			<div className={styles.firstView}>
				{maintenanceMessageList.length > 0 && (
					<AttentionMessage maintenanceMessageList={maintenanceMessageList} />
				)}
				<div className={styles.topBanner}>
					<TopBanner bannerList={bannerList} />
				</div>
				<MainPanel aside={<TopAside />} />
			</div>
			<MiniBanner miniBanners={miniBanners} />
			<PurchaseSeriesRepeatRecommend />
			<RadarChartRecommend />
			<ViewHistory />
			<ViewHistorySimulPurchase />
			<FeaturedContents />
			<News newsArticleList={newsArticleList} />
		</div>
	);
};
Home.displayName = 'Home';

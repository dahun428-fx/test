import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { getAttentions } from '@/api/services/legacy/cms/home/getAttentions';
import { getNewsArticle } from '@/api/services/legacy/cms/home/getNewsArticle';
import { getTopBanner } from '@/api/services/legacy/cms/home/getTopBanner';
import { getMiniBanner } from '@/api/services/legacy/htmlContents/home/getMiniBanner';
import type {
	Props as HomeProps,
	MiniBanners,
} from '@/components/pc/pages/Home';
import { MaintenanceMessage } from '@/models/api/cms/home/GetAttentionsResponse';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';
import styles from '@/styles/pc/legacy/home.module.scss';

type Props = {
	bannerList: Banner[];
	maintenanceMessageList: MaintenanceMessage[];
	miniBanners: MiniBanners;
	newsArticleList: NewsArticle[];
};

// NEW_FE-3691 SSR すると Vercel のメモリ上限 1GB に到達するため、SSR を妨害
const Home = dynamic<HomeProps>(
	() => import('@/components/pc/pages/Home').then(module => module.Home),
	{ ssr: false }
);

const HomePage: NextPage<Props> = props => {
	return <Home className={styles.home} {...props} />;
};
HomePage.displayName = 'HomePage';

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const [
		topBanner,
		attentions,
		miniBannerForCommonUser,
		miniBannerForPurchaseLinkUser,
		newsArticles,
	] = await Promise.allSettled([
		getTopBanner(),
		getAttentions(),
		getMiniBanner(false),
		getMiniBanner(true),
		getNewsArticle(),
	]);

	// IMJ サーバにホスティングされるコンテンツについては datadog にエラーログ送信していません。
	// (例: topBanner, attentions, miniBanner, newsArticles)

	return {
		props: {
			bannerList:
				topBanner.status === 'fulfilled'
					? topBanner.value.bannerList ?? []
					: [],
			maintenanceMessageList:
				attentions.status === 'fulfilled'
					? attentions.value.maintenanceMessageList ?? []
					: [],
			miniBanners: {
				html:
					miniBannerForCommonUser.status === 'fulfilled'
						? miniBannerForCommonUser.value
						: '',
				purchaseLinkHtml:
					miniBannerForPurchaseLinkUser.status === 'fulfilled'
						? miniBannerForPurchaseLinkUser.value
						: '',
			},
			newsArticleList:
				newsArticles.status === 'fulfilled'
					? newsArticles.value.newsArticleList ?? []
					: [],
		},
	};
};

export default HomePage;

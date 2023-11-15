import { GetStaticProps } from 'next';
import { getAttentions } from '@/api/services/legacy/cms/home/getAttentions';
import { getNewsArticle } from '@/api/services/legacy/cms/home/getNewsArticle';
import { getTopBanner } from '@/api/services/legacy/cms/home/getTopBanner';
import { searchCategory } from '@/api/services/searchCategory';
import { Home } from '@/components/mobile/pages/Home';
import { Standard } from '@/layouts/mobile/standard';
import { MaintenanceMessage } from '@/models/api/cms/home/GetAttentionsResponse';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { NextPageWithLayout } from '@/pages/types';

type Props = {
	bannerList: Banner[];
	maintenanceMessageList: MaintenanceMessage[];
	newsArticleList: NewsArticle[];
	topCategoryList: Category[];
};

const HomePage: NextPageWithLayout<Props> = props => {
	return <Home {...props} />;
};
HomePage.displayName = 'HomePage';
HomePage.getLayout = Standard;

export const getStaticProps: GetStaticProps<Props> = async () => {
	const [topBanner, attentions, newsArticles, categories] =
		await Promise.allSettled([
			getTopBanner(),
			getAttentions(),
			getNewsArticle(),
			searchCategory(),
		]);

	// eslint-disable-next-line no-console
	console.log('[ISR] Home', {
		fetchStatus: {
			banner: topBanner.status,
			attention: attentions.status,
			news: newsArticles.status,
			category: categories.status,
		},
	});

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
			newsArticleList:
				newsArticles.status === 'fulfilled'
					? newsArticles.value.newsArticleList ?? []
					: [],
			topCategoryList:
				categories.status === 'fulfilled'
					? categories.value.categoryList ?? []
					: [],
		},
		revalidate: 1800,
	};
};

export default HomePage;

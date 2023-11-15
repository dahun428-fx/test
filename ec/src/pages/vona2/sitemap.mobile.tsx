import { Sitemap } from '@/components/mobile/pages/Sitemap';
import { Standard } from '@/layouts/mobile/standard';
import { NextPageWithLayout } from '@/pages/types';

/**
 * Sitemap.
 */
const SitemapPage: NextPageWithLayout = () => {
	return <Sitemap />;
};
SitemapPage.displayName = 'SitemapPage';
SitemapPage.getLayout = Standard;
export default SitemapPage;

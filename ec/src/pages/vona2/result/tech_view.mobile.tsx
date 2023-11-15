import { useRouter } from 'next/router';
import type { SharedQuery } from './tech_view.type';
import { TechView } from '@/components/mobile/pages/TechView';
import { Standard } from '@/layouts/mobile/standard';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';

export type Query = SharedQuery;

/**
 * Tech view page
 */
const TechViewPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { kw } = router.query;

	if (!router.isReady) {
		return null;
	}

	assertNotNull(kw);
	const keyword = typeof kw === 'string' ? kw : last(kw);
	assertNotNull(keyword);

	return <TechView keyword={keyword} />;
};

TechViewPage.displayName = 'TechViewPage';
TechViewPage.getLayout = Standard;
export default TechViewPage;

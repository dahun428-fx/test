import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { SharedQuery } from './tech_view.type';
import { TechView } from '@/components/pc/pages/TechView';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';

export type Query = SharedQuery;

/**
 * Tech view page
 */
const TechViewPage: NextPage = () => {
	const router = useRouter();
	const { kw } = router.query;

	assertNotNull(kw);
	const keyword = typeof kw === 'string' ? kw : last(kw);
	assertNotNull(keyword);

	return <TechView keyword={keyword} />;
};

TechViewPage.displayName = 'TechViewPage';
export default TechViewPage;

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { queryManager } from '@/api/managers/queryManager';
import { getCompare } from '@/services/localStorage/compare';
import { CompareDetail } from '@/components/pc/pages/CompareDetail';
import { getOneParam, getOneParams } from '@/utils/query';
import { assertNotEmpty } from '@/utils/assertions';

const CompareDetailPage: NextPage = () => {
	const router = useRouter();
	const { categoryCode } = getOneParams(router.query, ...['categoryCode']);

	if (!router.isReady) {
		return null;
	}

	assertNotEmpty(categoryCode);

	return <CompareDetail categoryCode={categoryCode} />;
};
CompareDetailPage.displayName = 'CompareDetailPage';
export default CompareDetailPage;

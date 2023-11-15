import { NextPage } from 'next';
import { MakerList } from '@/components/pc/pages/maker/MakerList';

/** Maker list page */
const MakerListPage: NextPage = () => {
	return <MakerList />;
};
MakerListPage.displayName = 'MakerListPage';
export default MakerListPage;

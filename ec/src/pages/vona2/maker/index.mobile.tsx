import { MakerList } from '@/components/pc/pages/maker/MakerList';
import { Standard } from '@/layouts/pc/standard';
import { NextPageWithLayout } from '@/pages/types';

/** Maker list page */
const MakerListPage: NextPageWithLayout = () => {
	return <MakerList />;
};
MakerListPage.displayName = 'MakerListPage';
MakerListPage.getLayout = Standard;
export default MakerListPage;

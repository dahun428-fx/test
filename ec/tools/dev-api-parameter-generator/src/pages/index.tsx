import { NextPage } from 'next';
import { Home } from '@/components/pages/Home';

const HomePage: NextPage = () => {
	return <Home />;
};
HomePage.displayName = 'HomePage';

export default HomePage;

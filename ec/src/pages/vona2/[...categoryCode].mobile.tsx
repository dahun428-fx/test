import dynamic from 'next/dynamic';
import type { Props, SharedQuery } from './[...categoryCode].types';
import { Standard } from '@/layouts/mobile/standard';
import type { NextPageWithLayout } from '@/pages/types';

export type OptionalQuery = SharedQuery;

// SSR すると Vercel のメモリ上限 1GB に到達するため、SSR を妨害
// eslint-disable-next-line @typescript-eslint/ban-types
const Category = dynamic<{}>(
	() =>
		import('@/components/mobile/pages/Category').then(
			module => module.Category
		),
	{ ssr: false }
);
const CategoryPage: NextPageWithLayout<Props> = props => {
	return <Category {...props} />;
};
CategoryPage.displayName = 'CategoryPage';
CategoryPage.getLayout = Standard;

export default CategoryPage;

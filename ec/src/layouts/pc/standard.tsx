import dynamic from 'next/dynamic';
import { GetLayout } from '@/pages/types';

// eslint-disable-next-line @typescript-eslint/ban-types
const Layout = dynamic<{}>(
	() => import('@/components/pc/layouts/Layout').then(({ Layout }) => Layout),
	{ ssr: false }
);

export const Standard: GetLayout = page => {
	return <Layout>{page}</Layout>;
};

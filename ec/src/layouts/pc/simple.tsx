import dynamic from 'next/dynamic';
import { GetLayout } from '@/pages/types';

// eslint-disable-next-line @typescript-eslint/ban-types
const SimpleLayout = dynamic<{}>(
	() =>
		import('@/components/pc/layouts/SimpleLayout').then(
			({ SimpleLayout }) => SimpleLayout
		),
	{ ssr: false }
);

export const Simple: GetLayout = page => {
	return <SimpleLayout>{page}</SimpleLayout>;
};

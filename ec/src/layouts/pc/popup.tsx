import { GetLayout } from '@/pages/types';
import dynamic from 'next/dynamic';

// eslint-disable-next-line @typescript-eslint/ban-types
const PopupLayout = dynamic<{}>(
	() =>
		import('@/components/pc/layouts/PopupLayout').then(
			({ PopupLayout }) => PopupLayout
		),
	{
		ssr: false,
	}
);

export const Popup: GetLayout = page => {
	return <PopupLayout>{page}</PopupLayout>;
};

import { SimpleLayout } from '@/components/mobile/layouts/SimpleLayout';
import { GetLayout } from '@/pages/types';

export const Simple: GetLayout = page => {
	return <SimpleLayout>{page}</SimpleLayout>;
};

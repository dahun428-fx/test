import { Layout } from '@/components/mobile/layouts/Layout';
import { GetLayout } from '@/pages/types';

export const Standard: GetLayout = page => {
	return <Layout>{page}</Layout>;
};

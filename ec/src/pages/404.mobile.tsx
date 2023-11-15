import React from 'react';
import { NotFound } from '@/components/mobile/pages/NotFound';
import { Standard } from '@/layouts/mobile/standard';
import { NextPageWithLayout } from '@/pages/types';

/** Not found page */
const NotFoundPage: NextPageWithLayout = () => {
	return <NotFound />;
};

NotFoundPage.displayName = 'NotFoundPage';
NotFoundPage.getLayout = Standard;
export default NotFoundPage;

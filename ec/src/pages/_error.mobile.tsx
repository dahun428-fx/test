import React from 'react';
import { ApplicationErrorContents } from '@/components/mobile/error/ApplicationErrorContents';
import { Standard } from '@/layouts/mobile/standard';
import { NextPageWithLayout } from '@/pages/types';

/** Error page */
const ErrorPage: NextPageWithLayout = () => {
	return <ApplicationErrorContents />;
};

ErrorPage.displayName = 'ErrorPage';
ErrorPage.getLayout = Standard;
export default ErrorPage;

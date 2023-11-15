import Head from 'next/head';
import '@/styles/mobile/normalize.scss';
import '@/i18n';
import '@/utils/routerHistory';
import React from 'react';
import { Provider } from 'react-redux';
import { AdobeAnalytics } from '@/components/analytics/AdobeAnalytics';
import { Cameleer } from '@/components/analytics/Cameleer';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { None } from '@/layouts/none';
import { clientLoggerInitializer } from '@/logs/datadog/initialize';
import type { AppPropsWithLayout } from '@/pages/types';
import { store } from '@/store';
import { datadogRumInitializer } from '@/utils/datadogRUM/initialize';

datadogRumInitializer('mobile');
clientLoggerInitializer('mobile');

/**
 * Custom App
 */
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
	const getLayout = Component.getLayout || None;

	return (
		<>
			<Head>
				<title>
					{/* TODO: ロジック実装、i18n 対応 */}
					MISUMI Malaysia: Industrial Configurable Components Supply
				</title>
				{/* viewport meta tags は _document.tsx に定義すると警告が出るため _app.tsx に定義しています */}
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			<Provider store={store}>
				{getLayout(<Component {...pageProps} />)}
				<GoogleAnalytics />
				<AdobeAnalytics />
				<Cameleer />
			</Provider>
		</>
	);
};

export default App;

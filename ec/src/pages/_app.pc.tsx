import Head from 'next/head';
import '@/styles/pc/normalize.scss';
import '@/styles/pc/legacy/common.scss';
import '@/polyfills';
import '@/i18n';
import '@/utils/routerHistory';
import { Provider } from 'react-redux';
import { AdobeAnalytics } from '@/components/analytics/AdobeAnalytics';
import { Cameleer } from '@/components/analytics/Cameleer';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { ErrorHandler } from '@/components/pc/error/ErrorHandler';
import { Standard } from '@/layouts/pc/standard';
import { clientLoggerInitializer } from '@/logs/datadog/initialize';
import type { AppPropsWithLayout } from '@/pages/types';
import { store } from '@/store';
import { datadogRumInitializer } from '@/utils/datadogRUM/initialize';

datadogRumInitializer('pc');
clientLoggerInitializer('pc');

/**
 * Custom App
 */
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
	const getLayout = Component.getLayout || Standard;

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
				<ErrorHandler />
				<GoogleAnalytics />
				<AdobeAnalytics />
				<Cameleer />
			</Provider>
		</>
	);
};
export default App;

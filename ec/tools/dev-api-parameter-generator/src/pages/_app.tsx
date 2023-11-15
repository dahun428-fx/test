import { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/normalize.scss';

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<Head>
				<title>dev:api parameter generator</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Component {...pageProps} />
		</>
	);
};
export default App;

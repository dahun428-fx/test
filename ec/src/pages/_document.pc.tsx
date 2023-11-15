import RawDocument, { Head, Html, Main, NextScript } from 'next/document';
import { config } from '@/config';

/** Custom Document */
class Document extends RawDocument {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="shortcut icon" href="/favicon.ico" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
					<meta httpEquiv="content-style-type" content="text/css" />
					<meta httpEquiv="content-script-type" content="text/javascript" />
					<meta httpEquiv="x-dns-prefetch-control" content="on" />
					<link
						rel="dns-prefetch"
						href={`//${config.cdn.domain.cloudinary.global}`}
					/>
					<link rel="dns-prefetch" href={`//${config.cdn.domain.images}`} />
					<link
						rel="dns-prefetch"
						// NOTE: config には origin で定義されているので、プロトコルを除去。必要に応じて修正。
						href={`//${config.api.ect.origin.replace('https://', '')}`}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
export default Document;

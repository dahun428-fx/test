import Head from 'next/head';
import React from 'react';

type Props = {
	description?: string;
	keywords?: string;
	formatDetection?: string;
	canonicalUrl?: string;
	dnsPrefetchLinks?: string[];
	robots?: `noindex,nofollow`;
};

/** Get protocol relative url */
const getProtocolRelativeURL = (url: string) => {
	if (
		url.startsWith('https://') ||
		url.startsWith('http://') ||
		url.startsWith('//')
	) {
		return url;
	}

	return `//${url}`;
};

/** Meta Tags */
const MetaTags: React.VFC<Props> = ({
	description,
	keywords,
	formatDetection,
	canonicalUrl,
	dnsPrefetchLinks,
	robots,
}) => {
	return (
		<Head>
			{description !== undefined && (
				<meta name="description" content={description} />
			)}
			{keywords !== undefined && <meta name="keywords" content={keywords} />}
			{formatDetection !== undefined && (
				<meta name="format-detection" content={formatDetection} />
			)}
			{robots !== undefined && <meta name="robots" content={robots} />}
			{dnsPrefetchLinks !== undefined && dnsPrefetchLinks.length > 0 && (
				<>
					{dnsPrefetchLinks.map((href, index) => (
						<link
							key={`${href}-${index}`}
							rel="dns-prefetch"
							href={getProtocolRelativeURL(href)}
						/>
					))}
				</>
			)}
			{canonicalUrl !== undefined && (
				<link rel="canonical" href={canonicalUrl} />
			)}
		</Head>
	);
};
MetaTags.displayName = `MetaTags`;

export default MetaTags;

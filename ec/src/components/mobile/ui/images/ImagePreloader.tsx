import Head from 'next/head';
import React from 'react';

type Props = {
	href: string;
};
export const ImagePreloader: React.VFC<Props> = ({ href }) => {
	return (
		<Head>
			<link rel="preload" href={href} as="image" />
		</Head>
	);
};
ImagePreloader.displayName = 'ImagePreloader';

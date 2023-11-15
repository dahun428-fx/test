import Head from 'next/head';
import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';

/** Site map meta component */
export const Meta: VFC = () => {
	const [t] = useTranslation();

	return (
		<Head>
			<title>{t('mobile.pages.sitemap.meta.title')}</title>
			<meta
				name="description"
				content={t('mobile.pages.sitemap.meta.description')}
			/>
			<meta name="keywords" content={t('mobile.pages.sitemap.meta.keywords')} />
		</Head>
	);
};

Meta.displayName = 'Meta';

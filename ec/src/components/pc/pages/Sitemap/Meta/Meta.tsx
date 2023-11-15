import Head from 'next/head';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';

/** Sitemap Meta component */
export const Meta: VFC = () => {
	const [t] = useTranslation();

	return (
		<Head>
			<title>{t('pages.sitemap.meta.title')}</title>
			<meta name="description" content={t('pages.sitemap.meta.description')} />
			<meta name="keywords" content={t('pages.sitemap.meta.keywords')} />
		</Head>
	);
};
Meta.displayName = 'Meta';

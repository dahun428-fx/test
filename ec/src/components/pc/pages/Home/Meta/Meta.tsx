import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { pagesPath } from '@/utils/$path';
import { convertToURLString } from '@/utils/url';

export const Meta = () => {
	const { t } = useTranslation();

	return (
		<Head>
			<title>{t('pages.home.meta.title')}</title>
			<meta name="description" content={t('pages.home.meta.description')} />
			<meta name="keywords" content={t('pages.home.meta.keywords')} />
			<meta name="format-detection" content="telephone=no" />
			<link rel="canonical" href={convertToURLString(pagesPath.$url())} />
		</Head>
	);
};

Meta.displayName = 'Meta';

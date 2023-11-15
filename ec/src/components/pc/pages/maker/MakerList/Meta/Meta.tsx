import Head from 'next/head';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';

/** Maker list meta component */
export const Meta: VFC = () => {
	const [t] = useTranslation();

	return (
		<Head>
			<title>{t('pages.maker.makerList.meta.title')}</title>
			<meta
				name="description"
				content={t('pages.maker.makerList.meta.description')}
			/>
			<meta
				name="keywords"
				content={t('pages.maker.makerList.meta.keywords')}
			/>
		</Head>
	);
};
Meta.displayName = 'Meta';

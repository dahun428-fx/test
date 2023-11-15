import Head from 'next/head';
import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	keyword?: string;
};

/** Tech view meta component */
export const Meta: VFC<Props> = ({ keyword }) => {
	const { t } = useTranslation();

	return (
		<Head>
			<title>{t('pages.techView.meta.title', { keyword })}</title>
			<meta name="description" content="" />
			<meta name="keywords" content="" />
		</Head>
	);
};

Meta.displayName = 'Meta';

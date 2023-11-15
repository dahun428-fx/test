import { TFunctionResult } from 'i18next';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	title: TFunctionResult;
	noSuffix?: boolean;
};

/** Head title */
const HeadTitle: React.VFC<Props> = ({ title, noSuffix }) => {
	/** translator */
	const { t } = useTranslation();

	const headTitle = useMemo(() => {
		if (noSuffix) {
			return title;
		}

		return `${title} | ${t('mobile.components.head.headTitle.titleSuffix')}`;
	}, [noSuffix, t, title]);

	return (
		<Head>
			<title>{headTitle}</title>
		</Head>
	);
};

HeadTitle.displayName = `HeadTitle`;

export default HeadTitle;

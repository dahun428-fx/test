import Head from 'next/head';
import { useTranslation } from 'react-i18next';

type Props = {
	keyword: string;
	seriesPage?: number;
};

export const KeywordSearchMeta: React.VFC<Props> = ({
	keyword,
	seriesPage = 1,
}) => {
	const { t } = useTranslation();

	// page
	const page = t('pages.keywordSearch.keywordSearchMeta.page', { seriesPage });

	// title
	const title = t('pages.keywordSearch.keywordSearchMeta.title', {
		page: seriesPage > 1 ? `${page} ` : '',
		keyword,
	});

	// description
	const description = t('pages.keywordSearch.keywordSearchMeta.description', {
		prefix: t('pages.keywordSearch.keywordSearchMeta.descriptionPrefix', {
			page: seriesPage > 1 ? ` ${page}` : '',
			keyword,
		}),
	});

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content="" />;
		</Head>
	);
};

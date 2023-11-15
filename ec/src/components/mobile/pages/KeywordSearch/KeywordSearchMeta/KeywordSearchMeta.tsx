import Head from 'next/head';
import { useTranslation } from 'react-i18next';

type Props = {
	keyword: string;
	seriesPage?: number;
};

/** Keyword search meta component */
export const KeywordSearchMeta: React.VFC<Props> = ({
	keyword,
	seriesPage = 1,
}) => {
	const [t] = useTranslation();

	// page
	const page = t('mobile.pages.keywordSearch.keywordSearchMeta.page', {
		seriesPage,
	});

	// title
	const title = t('mobile.pages.keywordSearch.keywordSearchMeta.title', {
		page: seriesPage > 1 ? `${page} ` : '',
		keyword,
	});

	// description
	const description = t(
		'mobile.pages.keywordSearch.keywordSearchMeta.description',
		{
			prefix: t(
				'mobile.pages.keywordSearch.keywordSearchMeta.descriptionPrefix',
				{
					page: seriesPage > 1 ? ` ${page}` : '',
					keyword,
				}
			),
		}
	);

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content="" />;
			<meta
				name="format-detection"
				content="telephone=no, email=no, address=no"
			/>
		</Head>
	);
};
KeywordSearchMeta.displayName = 'KeywordSearchMeta';

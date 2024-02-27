import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductDocuments.module.scss';
import {
	CatalogLink,
	CatalogLinkTitle,
} from '@/components/pc/pages/ProductDetail/CatalogLink';
import { SdsLinkListModal } from '@/components/pc/pages/ProductDetail/SdsLinkListModal';
import { Link } from '@/components/pc/ui/links';
import { ModalOpener, ModalProvider } from '@/components/pc/ui/modals';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

type Props = {
	series: Series;
} & CatalogLinkTitle;

export const ProductDocuments: React.VFC<Props> = ({ series, linkTitle }) => {
	const { t } = useTranslation();

	const {
		msdsList = [],
		digitalBookPdfUrl,
		digitalBookList = [],
		misumiFlag,
		pdfNoticeText,
	} = series;

	if (!msdsList.length && !digitalBookPdfUrl) {
		return null;
	}

	return (
		<ul className={styles.pdfLinkList}>
			{digitalBookPdfUrl && (
				<li className={styles.pdfLink}>
					<CatalogLink
						digitalBookPdfUrl={digitalBookPdfUrl}
						misumiFlag={misumiFlag}
						pdfNoticeText={pdfNoticeText}
						digitalBookList={digitalBookList}
						linkTitle={linkTitle}
					/>
				</li>
			)}
			{msdsList.length > 0 && (
				<ModalProvider>
					<ModalOpener>
						<li className={styles.pdfLink}>
							<Link
								href=""
								className={styles.pdfLinkText}
								onClick={e => e.preventDefault()}
							>
								{t('pages.productDetail.complex.productAttributes.sdsLink')}
							</Link>
						</li>
					</ModalOpener>
					<SdsLinkListModal msdsList={msdsList} />
				</ModalProvider>
			)}
		</ul>
	);
};
ProductDocuments.displayName = 'ProductDocuments';

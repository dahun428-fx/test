import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductDocuments.module.scss';
import { CatalogLink } from '@/components/pc/pages/ProductDetail/CatalogLink';
import { SdsLinkListModal } from '@/components/pc/pages/ProductDetail/SdsLinkListModal';
import { Link } from '@/components/pc/ui/links';
import { ModalOpener, ModalProvider } from '@/components/pc/ui/modals';
import { Flag } from '@/models/api/Flag';
import { DigitalBook, Msds } from '@/models/api/msm/ect/series/shared';

type Props = {
	msdsList?: Msds[];
	digitalBookPdfUrl?: string;
	digitalBookList?: DigitalBook[];
	misumiFlag: Flag;
	pdfNoticeText?: string;
};

export const ProductDocuments: React.VFC<Props> = ({
	msdsList = [],
	digitalBookPdfUrl,
	digitalBookList = [],
	misumiFlag,
	pdfNoticeText,
}) => {
	const { t } = useTranslation();

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

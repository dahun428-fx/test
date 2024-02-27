import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CatalogLink.module.scss';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { Flag } from '@/models/api/Flag';
import { DigitalBook } from '@/models/api/msm/ect/series/shared';
import { openSubWindow } from '@/utils/window';

export type CatalogLinkTitle = {
	linkTitle?: 'catalog' | 'pdf';
};

type Props = {
	digitalBookPdfUrl: string;
	misumiFlag: Flag;
	pdfNoticeText?: string;
	digitalBookList?: DigitalBook[];
} & CatalogLinkTitle;

/**
 * Catalog link
 */
export const CatalogLink: React.VFC<Props> = ({
	digitalBookPdfUrl,
	misumiFlag,
	linkTitle = 'catalog',
	pdfNoticeText,
	digitalBookList = [],
}) => {
	const [t] = useTranslation();
	const page = digitalBookList[0]?.digitalBookPage;

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (Flag.isFalse(misumiFlag)) {
			event.preventDefault();
			openSubWindow(digitalBookPdfUrl, 'digitalBookWin', {
				width: 920,
				height: 703,
			});
		}
		aa.events.sendDownloadCatalog();
		ga.events.downloadPdf();
	};

	return (
		<>
			<a
				href={digitalBookPdfUrl}
				target="_blank"
				className={styles.link}
				onClick={handleClick}
				rel="noreferrer"
			>
				{t(`pages.productDetail.catalogLink.${linkTitle}`)}
				{/* Display page only misumi products */}
				{Flag.isTrue(misumiFlag) && page && (
					<span className={styles.page}>
						{t('pages.productDetail.catalogLink.page', { page })}
					</span>
				)}
			</a>
			{pdfNoticeText && <p className={styles.notice}>{pdfNoticeText}</p>}
		</>
	);
};
CatalogLink.displayName = 'CatalogLink';

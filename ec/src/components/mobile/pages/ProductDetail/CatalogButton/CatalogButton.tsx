import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDigitalBook } from './CatalogButton.hooks';
import styles from './CatalogButton.module.scss';
import { LinkButton } from '@/components/mobile/ui/buttons';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { openSubWindow } from '@/utils/window';

type Props = {
	className?: string;
};

/**
 * Catalog button
 * - We named Catalog"Button" because something like CatalogViewer may be born.
 */
export const CatalogButton: React.VFC<Props> = ({ className }) => {
	const [t] = useTranslation();
	const digitalBook = useDigitalBook();

	if (!digitalBook) {
		return null;
	}

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		openSubWindow(digitalBook.digitalBookPdfUrl, '');
		aa.events.sendDownloadCatalog();
		ga.events.downloadPdf();
	};

	return (
		<div className={className}>
			<LinkButton
				href={digitalBook.digitalBookPdfUrl}
				icon="pdf"
				className={styles.button}
				onClick={handleClick}
			>
				<span className={styles.buttonText}>
					{t('mobile.pages.productDetail.catalogButton.catalog')}
					{digitalBook.digitalBookPage && (
						<span className={styles.page}>
							{t('mobile.pages.productDetail.catalogButton.page', {
								page: digitalBook.digitalBookPage,
							})}
						</span>
					)}
				</span>
			</LinkButton>
			{digitalBook.pdfNoticeText && (
				<div className={styles.notice}>{digitalBook.pdfNoticeText}</div>
			)}
		</div>
	);
};
CatalogButton.displayName = 'CatalogButton';

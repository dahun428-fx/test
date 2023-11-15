import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Catalog.module.scss';
import {
	SelectedBook,
	SelectedPage,
} from '@/components/pc/pages/ProductDetail/Catalog/Catalog.types';
import { CatalogViewer } from '@/components/pc/pages/ProductDetail/Catalog/CatalogViewer';
import { ViewerSize } from '@/components/pc/pages/ProductDetail/Catalog/CatalogViewer/CatalogViewer';
import { PageNav } from '@/components/pc/pages/ProductDetail/Catalog/PageNav';
import { InformationMessage } from '@/components/pc/ui/messages/InformationMessage';
import { DigitalBookIndexes } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { DigitalBook } from '@/models/api/msm/ect/series/shared';

type Props = {
	digitalBookList?: DigitalBook[];
	digitalBookPdfUrl?: string;
	digitalBookNoticeText?: string;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
	selectedBook: SelectedBook;
	displayHeader?: boolean;
	fullWidthView?: boolean;
	stickyBottomBoundary?: string | number;
	preferredViewerSize?: ViewerSize;
	onChangeBook: (book: SelectedBook) => void;
	onChangePage: (page: SelectedPage) => void;
};

/**
 * Catalog
 */
export const Catalog: React.VFC<Props> = ({
	digitalBookList = [],
	digitalBookNoticeText,
	bookIndexes,
	pageList,
	selectedBook,
	displayHeader = true,
	fullWidthView = false,
	stickyBottomBoundary,
	preferredViewerSize,
	onChangeBook,
	onChangePage,
}) => {
	const { t } = useTranslation();

	return (
		<div>
			{displayHeader && (
				<h3 className={styles.heading}>
					{t('pages.productDetail.catalog.heading')}
				</h3>
			)}
			<div>
				<div className={styles.pageNav}>
					<PageNav
						digitalBookList={digitalBookList}
						selectedBook={selectedBook}
						bookIndexes={bookIndexes}
						pageList={pageList}
						onChangeBook={onChangeBook}
						onChangePage={onChangePage}
					/>
				</div>
				{digitalBookNoticeText && (
					<ul>
						<li>
							<InformationMessage className={styles.noticeText}>
								{digitalBookNoticeText}
							</InformationMessage>
						</li>
					</ul>
				)}
				<div className={styles.viewer}>
					<CatalogViewer
						selectedBook={selectedBook}
						bookIndexes={bookIndexes}
						pageList={pageList}
						fullWidthView={fullWidthView}
						onChangePage={onChangePage}
						stickyBottomBoundary={stickyBottomBoundary}
						preferredViewerSize={preferredViewerSize}
					/>
				</div>
			</div>
		</div>
	);
};
Catalog.displayName = 'Catalog';

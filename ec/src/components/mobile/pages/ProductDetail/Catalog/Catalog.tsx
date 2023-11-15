import React, { MouseEvent } from 'react';
import styles from './Catalog.module.scss';
import { SelectedBook, SelectedPage } from './Catalog.types';
import { CatalogViewer } from './CatalogViewer';
import { PageNav } from './PageNav';
import { InformationMessage } from '@/components/mobile/ui/messages/InformationMessage';
import { DigitalBookIndexes } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { DigitalBook } from '@/models/api/msm/ect/series/shared';

type Props = {
	digitalBookList?: DigitalBook[];
	digitalBookPdfUrl?: string;
	digitalBookNoticeText?: string;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
	selectedBook: SelectedBook;
	onChangeBook: (book: SelectedBook) => void;
	onChangePage: (page: SelectedPage) => void;
	onOpen2PageView: (event: MouseEvent<HTMLAnchorElement>) => void;
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
	onChangeBook,
	onChangePage,
	onOpen2PageView,
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.pageNav}>
				<PageNav
					digitalBookList={digitalBookList}
					selectedBook={selectedBook}
					bookIndexes={bookIndexes}
					pageList={pageList}
					onChangeBook={onChangeBook}
					onChangePage={onChangePage}
					handleOpen2PageView={onOpen2PageView}
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
					onChangePage={onChangePage}
					handleOpen2PageView={onOpen2PageView}
				/>
			</div>
		</div>
	);
};
Catalog.displayName = 'Catalog';

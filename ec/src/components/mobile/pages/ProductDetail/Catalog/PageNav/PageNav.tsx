import React, { useCallback, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { PageForm } from './PageForm';
import styles from './PageNav.module.scss';
import {
	SelectedBook,
	SelectedPage,
} from '@/components/mobile/pages/ProductDetail/Catalog/Catalog.types';
import { LinkButton } from '@/components/mobile/ui/buttons';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { DigitalBookIndexes } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { DigitalBook } from '@/models/api/msm/ect/series/shared';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

type Props = {
	digitalBookList: DigitalBook[];
	selectedBook: SelectedBook;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
	onChangeBook: (book: SelectedBook) => void;
	onChangePage: (page: SelectedPage) => void;
	handleOpen2PageView: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Catalog page Navigator
 */
export const PageNav: React.VFC<Props> = ({
	digitalBookList,
	bookIndexes,
	pageList,
	selectedBook,
	onChangeBook,
	onChangePage,
	handleOpen2PageView,
}) => {
	const { t } = useTranslation();
	const { showMessage } = useMessageModal();

	const handleClickBookLink = useCallback(
		(event: MouseEvent<HTMLAnchorElement>, book: DigitalBook) => {
			event.preventDefault();
			onChangeBook(book);
		},
		[onChangeBook]
	);

	const handleChangePage = useCallback(
		(digitalBookPage: string) => {
			if (digitalBookPage === '' && notNull(pageList[1])) {
				return onChangePage({ digitalBookPage: pageList[1] });
			}

			if (bookIndexes[digitalBookPage] == null) {
				return showMessage(
					t('pages.productDetail.catalog.invalidPageMessage', {
						digitalBookPage,
					})
				);
			}
			onChangePage({ digitalBookPage });
		},
		[bookIndexes, onChangePage, pageList, showMessage, t]
	);

	return (
		<div className={styles.container}>
			<ul className={styles.pageNavs}>
				<li>
					<LinkButton
						theme="default"
						target="_blank"
						href={url.digitalBook2PageView(selectedBook)}
						icon="book"
						onClick={handleOpen2PageView}
					>
						{t('pages.productDetail.catalog.open2PageView')}
					</LinkButton>
				</li>
				<li>
					<PageForm
						value={selectedBook.digitalBookPage}
						onSubmit={handleChangePage}
					/>
				</li>
			</ul>
			<ul className={styles.books}>
				{digitalBookList.map((book, index) => (
					<li key={index} className={styles.book}>
						<a
							href=""
							className={styles.link}
							onClick={event => handleClickBookLink(event, book)}
						>
							{book.digitalBookName}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};
PageNav.displayName = 'PageNav';

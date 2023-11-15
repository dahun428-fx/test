import React, { useCallback, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PageNav.module.scss';
import {
	SelectedBook,
	SelectedPage,
} from '@/components/pc/pages/ProductDetail/Catalog/Catalog.types';
import { PageForm } from '@/components/pc/pages/ProductDetail/Catalog/PageNav/PageForm';
import { LinkButton } from '@/components/pc/ui/buttons';
import { Slider } from '@/components/pc/ui/controls/sliders';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { DigitalBookIndexes } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { DigitalBook } from '@/models/api/msm/ect/series/shared';
import { formatPageDisp } from '@/utils/domain/catalog';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

type Props = {
	digitalBookList: DigitalBook[];
	selectedBook: SelectedBook;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
	onChangeBook: (book: SelectedBook) => void;
	onChangePage: (page: SelectedPage) => void;
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

	const handleOpen2PageView = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();

			if (event.currentTarget.href) {
				openSubWindow(event.currentTarget.href, 'digitalBookWin', {
					width: 920,
					height: 703,
				});
			}
		},
		[]
	);

	return (
		<div className={styles.container}>
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

			<ul className={styles.pageNavs}>
				<li className={styles.sliderWrap}>
					<Slider
						value={selectedBook.digitalBookPage}
						min={1}
						max={pageList.length - 2}
						values={pageList}
						ariaValueTextFormatter={index => formatPageDisp(pageList[index])}
						onChange={handleChangePage}
					/>
				</li>
				<li className={styles.formWrap}>
					<PageForm
						value={selectedBook.digitalBookPage}
						onSubmit={handleChangePage}
					/>
				</li>
				<li className={styles.openerWrap}>
					<LinkButton
						theme="default"
						target="_blank"
						href={url.digitalBook2PageView(selectedBook)}
						icon="pdf"
						onClick={handleOpen2PageView}
					>
						{t('pages.productDetail.catalog.open2PageView')}
					</LinkButton>
				</li>
			</ul>
		</div>
	);
};
PageNav.displayName = 'PageNav';

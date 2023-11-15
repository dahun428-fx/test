import React, { useCallback, useEffect, useState, MouseEvent } from 'react';
import { Catalog as Presenter } from './Catalog';
import { SelectedBook } from './Catalog.types';
import { getDigitalBookIndex } from '@/api/services/digitalBook/getDigitalBookIndex';
import { GetDigitalBookIndexResponse } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { useSelector } from '@/store/hooks';
import { selectRelatedDigitalBook } from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';
import { openSubWindow } from '@/utils/window';

/**
 * Catalog container.
 */
export const Catalog: React.VFC = () => {
	const { digitalBookList, ...rest } = useSelector(selectRelatedDigitalBook);
	const [firstBook] = digitalBookList;
	const [book, setBook] = useState<SelectedBook | undefined>(firstBook);
	const [bookIndexesPerBookCode, setBookIndexesPerBookCode] = useState<
		Record<string, GetDigitalBookIndexResponse>
	>({});

	const { pageList = [], bookIndexes = {} } = book?.digitalBookCode
		? bookIndexesPerBookCode[book.digitalBookCode] ?? {}
		: {};

	const handleChange = useCallback((book: Partial<SelectedBook>) => {
		setBook(prev => {
			// NOTE: book が選択されていない状態は digitalBookList が空のときだけであり、
			//       その場合は book を選択できないので、この handler は呼ばれない。
			assertNotNull(prev);
			return { ...prev, ...book };
		});
	}, []);

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

	useEffect(() => {
		// Obtain the number of catalogs for the index information in advance.
		for (const book of digitalBookList) {
			getDigitalBookIndex(book.digitalBookCode).then(response =>
				setBookIndexesPerBookCode(prev => ({
					...prev,
					[book.digitalBookCode]: response,
				}))
			);
		}
	}, [digitalBookList]);

	if (!book) {
		return null;
	}

	return (
		<Presenter
			{...rest}
			digitalBookList={digitalBookList}
			bookIndexes={bookIndexes}
			pageList={pageList}
			selectedBook={book}
			onChangeBook={handleChange}
			onChangePage={handleChange}
			onOpen2PageView={handleOpen2PageView}
		/>
	);
};
Catalog.displayName = 'Catalog';

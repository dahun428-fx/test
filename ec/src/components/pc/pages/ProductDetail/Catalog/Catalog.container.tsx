import React, { useCallback, useEffect, useState } from 'react';
import { Catalog as Presenter } from './Catalog';
import { SelectedBook } from './Catalog.types';
import { getDigitalBookIndex } from '@/api/services/digitalBook/getDigitalBookIndex';
import { ViewerSize } from '@/components/pc/pages/ProductDetail/Catalog/CatalogViewer/CatalogViewer';
import { Logger } from '@/logs/datadog';
import { GetDigitalBookIndexResponse } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { useSelector } from '@/store/hooks';
import { selectRelatedDigitalBook } from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	displayHeader?: boolean;
	fullWidthView?: boolean;
	stickyBottomBoundary?: string | number;
	preferredViewerSize?: ViewerSize;
};

/**
 * Catalog container.
 */
export const Catalog: React.VFC<Props> = ({
	displayHeader = true,
	fullWidthView = false,
	stickyBottomBoundary,
	preferredViewerSize,
}) => {
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

	useEffect(() => {
		// Obtain the number of catalogs for the index information in advance.
		for (const book of digitalBookList) {
			getDigitalBookIndex(book.digitalBookCode)
				.then(response =>
					setBookIndexesPerBookCode(prev => ({
						...prev,
						[book.digitalBookCode]: response,
					}))
				)
				.catch(error => {
					Logger.warn('GetDigitalBookIndex is fail', { error: String(error) });
				});
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
			displayHeader={displayHeader}
			fullWidthView={fullWidthView}
			stickyBottomBoundary={stickyBottomBoundary}
			preferredViewerSize={preferredViewerSize}
			onChangeBook={handleChange}
			onChangePage={handleChange}
		/>
	);
};
Catalog.displayName = 'Catalog';

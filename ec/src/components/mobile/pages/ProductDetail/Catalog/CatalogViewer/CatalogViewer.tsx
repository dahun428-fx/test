/* eslint-disable @next/next/no-img-element */

import classNames from 'classnames';
import React, { useCallback, useState, MouseEvent } from 'react';
import styles from './CatalogViewer.module.scss';
import { Pager } from './Pager';
import {
	SelectedBook,
	SelectedPage,
} from '@/components/mobile/pages/ProductDetail/Catalog/Catalog.types';
import { DigitalBookIndexes } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { formatPageDisp } from '@/utils/domain/catalog';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

type Props = {
	selectedBook: SelectedBook;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
	onChangePage: (page: SelectedPage) => void;
	handleOpen2PageView: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Catalog Viewer
 */
export const CatalogViewer: React.VFC<Props> = ({
	selectedBook,
	bookIndexes,
	pageList,
	onChangePage,
	handleOpen2PageView,
}) => {
	const { digitalBookCode, digitalBookPage } = selectedBook;
	const pageIndex = bookIndexes[digitalBookPage];
	const [hovering, setHovering] = useState(false);

	const handleChangePage = useCallback(
		(prevOrNext: 'prev' | 'next', index = Number(pageIndex)) => {
			const newIndex = parseInt(index) + (prevOrNext === 'prev' ? -1 : 1);
			const newPage = pageList[newIndex];

			const page = pageList[pageList.length - 2];
			if (newPage === '<<front>>' && notNull(page)) {
				return onChangePage({ digitalBookPage: page });
			}

			if (newPage === '<<back>>' && notNull(pageList[1])) {
				return onChangePage({ digitalBookPage: pageList[1] });
			}

			if (newPage == null) {
				handleChangePage(prevOrNext, newIndex);
			}

			if (newPage != undefined) {
				onChangePage({ digitalBookPage: newPage });
			}
		},
		[onChangePage, pageIndex, pageList]
	);

	return (
		<div
			className={classNames('catalogContainer', styles.container)}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			<a
				href={url.digitalBook2PageView(selectedBook)}
				onClick={handleOpen2PageView}
			>
				<img
					className={styles.catalogImage}
					src={url.digitalBookPage(digitalBookCode, pageIndex, '650')}
					alt={formatPageDisp(digitalBookPage)}
				/>
			</a>
			<Pager hovering={hovering} prevOrNext="prev" onClick={handleChangePage} />
			<Pager hovering={hovering} prevOrNext="next" onClick={handleChangePage} />
		</div>
	);
};
CatalogViewer.displayName = 'CatalogViewer';

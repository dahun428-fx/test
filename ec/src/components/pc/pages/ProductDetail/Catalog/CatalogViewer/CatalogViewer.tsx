/* eslint-disable @next/next/no-img-element */

import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import styles from './CatalogViewer.module.scss';
import {
	SelectedBook,
	SelectedPage,
} from '@/components/pc/pages/ProductDetail/Catalog/Catalog.types';
import { Pager } from '@/components/pc/pages/ProductDetail/Catalog/CatalogViewer/Pager';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { useBoolState } from '@/hooks/state/useBoolState';
import { DigitalBookIndexes } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';
import { formatPageDisp } from '@/utils/domain/catalog';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

type Props = {
	selectedBook: SelectedBook;
	bookIndexes: DigitalBookIndexes;
	pageList: string[];
	fullWidthView?: boolean;
	stickyBottomBoundary?: string | number;
	preferredViewerSize?: ViewerSize;
	onChangePage: (page: SelectedPage) => void;
};

const VIEWER_SIZE_BORDER = 1150;

const viewerWidth = { small: '650', large: '900' } as const;
const defaultPosition = {
	small: { x: 550, y: 790 },
	large: { x: 300, y: 430 },
} as const;

export type ViewerSize = 'small' | 'large';

function getViewerSize() {
	if (typeof document === 'undefined') {
		return 'large';
	}
	return document.documentElement.clientWidth < VIEWER_SIZE_BORDER
		? 'small'
		: 'large';
}

/**
 * Catalog Viewer
 */
export const CatalogViewer: React.VFC<Props> = ({
	selectedBook,
	bookIndexes,
	pageList,
	fullWidthView = false,
	stickyBottomBoundary,
	preferredViewerSize,
	onChangePage,
}) => {
	const { digitalBookCode, digitalBookPage } = selectedBook;
	const pageIndex = bookIndexes[digitalBookPage];
	const { bool: draggable, toggle: toggleDraggable } = useBoolState();
	const [viewerSize, setViewerSize] = useState<ViewerSize>(
		preferredViewerSize ? preferredViewerSize : getViewerSize()
	);
	const imageRef = useRef<HTMLImageElement>(null);
	const draggingRef = useRef<boolean>(false);
	const [hovering, setHovering] = useState(false);

	const bookSize = draggable ? 'o' : viewerWidth[viewerSize];

	/**
	 * drag end handler
	 * Not dragging, call "handleClick"
	 */
	const handleDragEnd = useCallback(() => {
		if (!draggingRef.current) {
			toggleDraggable();
		}
		draggingRef.current = false;
	}, [toggleDraggable]);

	/**
	 * calculate draggable image position.
	 */
	const handleDrag = useCallback((e: DraggableEvent) => {
		e.preventDefault();
		draggingRef.current = true;
	}, []);

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

	useEffect(() => {
		if (!preferredViewerSize) {
			const onResize = () => setViewerSize(getViewerSize());
			window.addEventListener('resize', onResize);
			return () => window.removeEventListener('resize', onResize);
		}
	}, [draggable, preferredViewerSize]);

	return (
		<div
			className={classNames('catalogContainer', styles.container)}
			data-draggable={draggable}
			data-viewer={viewerSize}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			{pageList.length > 0 ? (
				<>
					{draggable ? (
						<div className={styles.draggableZone}>
							<Draggable
								defaultPosition={defaultPosition[viewerSize]}
								handle=".catalogHandle"
								nodeRef={imageRef}
								bounds="parent"
								onDrag={handleDrag}
								onStop={handleDragEnd}
							>
								<img
									ref={imageRef}
									className="catalogHandle"
									src={url.digitalBookPage(
										digitalBookCode,
										pageIndex,
										bookSize
									)}
									alt={digitalBookPage}
								/>
							</Draggable>
						</div>
					) : (
						<img
							onClick={toggleDraggable}
							className={classNames({
								[String(styles.fullWidthImage)]: fullWidthView,
							})}
							src={url.digitalBookPage(digitalBookCode, pageIndex, bookSize)}
							alt={formatPageDisp(digitalBookPage)}
						/>
					)}
					<Pager
						hovering={hovering}
						prevOrNext="prev"
						onClick={handleChangePage}
						stickyBottomBoundary={stickyBottomBoundary}
					/>
					<Pager
						hovering={hovering}
						prevOrNext="next"
						onClick={handleChangePage}
						stickyBottomBoundary={stickyBottomBoundary}
					/>
				</>
			) : (
				<BlockLoader />
			)}
		</div>
	);
};
CatalogViewer.displayName = 'CatalogViewer';

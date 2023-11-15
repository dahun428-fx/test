import classNames from 'classnames';
import { CSSProperties, FC, useCallback, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './CrmPagination.module.scss';

type Props = {
	itemWidth: number;
	totalItems: number;
	pageSize: number;
	setPageSize: (pageSize: number) => void;
	goToNext: () => void;
	backToPrev: () => void;
	rowNumber?: number;
	listContainerStyle?: CSSProperties;
};

// NOTE: This is padding of pagination arrow
const HORIZONTAL_ARROW_PADDING = 64;

/** Calculate page size */
function calculatePageSize(containerWidth: number, itemWidth: number) {
	if (itemWidth <= 0) {
		return 0;
	}
	return Math.floor(containerWidth / itemWidth);
}

/** Crm Pagination component */
export const CrmPagination: FC<Props> = ({
	itemWidth,
	totalItems,
	pageSize,
	setPageSize,
	goToNext,
	backToPrev,
	rowNumber = 1,
	listContainerStyle,
	children,
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const isShowArrow = totalItems > pageSize;

	const handleChangePage = useCallback(
		(prevOrNext: 'prev' | 'next') => {
			prevOrNext === 'prev' ? backToPrev() : goToNext();
		},
		[backToPrev, goToNext]
	);

	useEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		const resize = () => {
			if (!wrapperRef.current) {
				return;
			}
			const pageSize =
				calculatePageSize(
					wrapperRef.current.clientWidth - HORIZONTAL_ARROW_PADDING * 2,
					itemWidth
				) * rowNumber;
			setPageSize(pageSize);
		};

		const observer = new ResizeObserver(resize);
		observer.observe(wrapperRef.current);

		return () => observer.disconnect();
	}, [itemWidth, totalItems, setPageSize, wrapperRef, rowNumber]);

	return (
		<div className={styles.container}>
			{isShowArrow && (
				<div
					className={styles.previous}
					onClick={() => handleChangePage('prev')}
				/>
			)}
			<div
				className={styles.itemListWrap}
				style={{ padding: isShowArrow ? `0 ${HORIZONTAL_ARROW_PADDING}px` : 0 }}
				ref={wrapperRef}
			>
				<ul
					className={classNames(styles.panelList, {
						[String(styles.noMargin)]: !isShowArrow,
					})}
					style={listContainerStyle}
				>
					{children}
				</ul>
			</div>
			{isShowArrow && (
				<div className={styles.next} onClick={() => handleChangePage('next')} />
			)}
		</div>
	);
};
CrmPagination.displayName = 'CrmPagination';

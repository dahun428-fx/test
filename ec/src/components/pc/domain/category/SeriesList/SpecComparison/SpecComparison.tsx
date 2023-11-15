import { VFC, useRef, useState, useLayoutEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './SpecComparison.module.scss';
import {
	SpecNameColumn,
	COLUMN_WIDTH as SPEC_NAME_COLUMN_WIDTH,
} from './SpecNameColumn';
import { SpecValueColumn } from './SpecValueColumn';
import { Flag } from '@/models/api/Flag';
import {
	Series,
	SeriesSpec,
	CadType,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getChildren, getHeight, getWidth } from '@/utils/dom';

type Props = {
	cadTypeList: CadType[];
	seriesList: Series[];
	seriesSpecList: SeriesSpec[];
	currencyCode?: string;
	stickyTop: number;
};

/** Spec comparison component */
export const SpecComparison: VFC<Props> = ({
	cadTypeList,
	seriesList,
	seriesSpecList,
	currencyCode,
	stickyTop,
}) => {
	const hasCadType = cadTypeList.some(cad => Flag.isFalse(cad.hiddenFlag));

	const fixedHeaderRef = useRef<HTMLTableSectionElement>(null);
	const fixedBodyRef = useRef<HTMLTableSectionElement>(null);

	const scrollHeaderRef = useRef<HTMLTableSectionElement>(null);
	const scrollBodyRef = useRef<HTMLTableSectionElement>(null);
	const specValueContainerRef = useRef<HTMLDivElement>(null);

	const [stickyHeights, setStickyHeights] = useState<number[]>([]);
	const [scrollHeights, setScrollHeights] = useState<number[]>([]);
	const [specValueContainerWidth, setSpecValueContainer] = useState(0);

	useLayoutEffect(() => {
		if (
			fixedHeaderRef.current == null ||
			fixedBodyRef.current == null ||
			scrollHeaderRef.current === null ||
			scrollBodyRef.current === null ||
			specValueContainerRef.current === null
		) {
			return;
		}

		const onResize = () => {
			if (
				fixedHeaderRef.current == null ||
				fixedBodyRef.current == null ||
				scrollHeaderRef.current === null ||
				scrollBodyRef.current === null ||
				specValueContainerRef.current === null
			) {
				return;
			}

			setSpecValueContainer(
				getWidth(specValueContainerRef.current) - SPEC_NAME_COLUMN_WIDTH
			);

			const fixedHeaderRows = getChildren(fixedHeaderRef.current);
			const fixedBodyRows = getChildren(fixedBodyRef.current);
			const scrollHeaderRows = getChildren(scrollHeaderRef.current);
			const scrollBodyRows = getChildren(scrollBodyRef.current);

			setStickyHeights(
				fixedHeaderRows.map((headerRow, index) => {
					const bodyRow = fixedBodyRows[index];
					return Math.max(
						getHeight(headerRow),
						bodyRow ? getHeight(bodyRow) : 0
					);
				})
			);

			setScrollHeights(
				scrollHeaderRows.map((headerRow, index) => {
					const bodyRow = scrollBodyRows[index];
					return Math.max(
						getHeight(headerRow),
						bodyRow ? getHeight(bodyRow) : 0
					);
				})
			);
		};

		onResize();
		const observer = new ResizeObserver(onResize);
		observer.observe(fixedHeaderRef.current);
		observer.observe(fixedBodyRef.current);
		observer.observe(scrollHeaderRef.current);
		observer.observe(scrollBodyRef.current);
		observer.observe(specValueContainerRef.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div className={styles.main} ref={specValueContainerRef}>
			<SpecNameColumn
				seriesSpecList={seriesSpecList}
				hasCadType={hasCadType}
				fixedHeaderRef={fixedHeaderRef}
				scrollHeaderRef={scrollHeaderRef}
				stickyHeights={stickyHeights}
				scrollHeights={scrollHeights}
				stickyTop={stickyTop}
			/>
			<SpecValueColumn
				seriesList={seriesList}
				seriesSpecList={seriesSpecList}
				currencyCode={currencyCode}
				hasCadType={hasCadType}
				fixedBodyRef={fixedBodyRef}
				scrollBodyRef={scrollBodyRef}
				stickyHeights={stickyHeights}
				scrollHeights={scrollHeights}
				stickyTop={stickyTop}
				specValueContainerWidth={specValueContainerWidth}
			/>
		</div>
	);
};
SpecComparison.displayName = 'SpecComparison';

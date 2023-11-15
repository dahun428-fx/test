import React, {
	RefObject,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import Sticky from 'react-stickynode';
import ResizeObserver from 'resize-observer-polyfill';
import { PartNumberSpecCells } from './PartNumberSpecCells';
import styles from './PartNumberSpecColumns.module.scss';
import { PartNumberSpecHeader } from './PartNumberSpecHeader';
import { RowActions } from '@/components/pc/pages/ProductDetail/PartNumberList/PartNumberList.type';
import { HorizontalScrollbarContainer } from '@/components/pc/ui/controls/interaction/HorizontalScrollBar';
import { Flag } from '@/models/api/Flag';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { getWidth } from '@/utils/dom';
import { fromEntries } from '@/utils/object';

type Props = {
	partNumberList: PartNumber[];
	specList: Spec[];
	relatedLinkFrameFlag: Flag;
	rohsFrameFlag: Flag;
	headerRef: RefObject<HTMLTableSectionElement>;
	bodyRef: RefObject<HTMLTableSectionElement>;
	headerHeight?: number;
	eachRowHeight?: number[];
	cursor: number;
	rowActions: RowActions;
	stickyTop: number;
	className?: string;
};

export const PartNumberSpecColumns: React.VFC<Props> = ({
	partNumberList,
	specList,
	relatedLinkFrameFlag,
	rohsFrameFlag,
	headerRef,
	bodyRef,
	headerHeight,
	eachRowHeight = [],
	cursor,
	rowActions,
	stickyTop,
	className,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [overflow, setOverflow] = useState(true);

	const oneMoreCandidates = partNumberList.length > 1;

	const nonStandardSpecList = useMemo(() => {
		return specList.filter(spec => Flag.isFalse(spec.standardSpecFlag));
	}, [specList]);

	const specValueMapList = useMemo(() => {
		return partNumberList.map(partNumber => ({
			partNumber,
			specValues: fromEntries(
				partNumber.specValueList.map(value => [
					value.specCode,
					value.specValueDisp,
				])
			),
		}));
	}, [partNumberList]);

	const columnCount =
		nonStandardSpecList.length + // specs
		1 + // quantity
		(Flag.isTrue(relatedLinkFrameFlag) ? 1 : 0) + // related link (SDS etc)
		(Flag.isTrue(rohsFrameFlag) ? 1 : 0); // RoHS
	const innerWidth = 120 * columnCount;
	const minInnerWidth = 58 * columnCount;

	useLayoutEffect(() => {
		// show or hide scrollbar
		if (containerRef.current && bodyRef.current) {
			setOverflow(getWidth(containerRef.current) < minInnerWidth);
			const observer = new ResizeObserver(([entry]) => {
				if (entry) {
					setOverflow(entry.contentRect.width < minInnerWidth);
				}
			});
			observer.observe(containerRef.current);
			return () => observer.disconnect();
		}
	}, [bodyRef, minInnerWidth]);

	return (
		<HorizontalScrollbarContainer
			className={className}
			ref={containerRef}
			enabled={overflow}
			innerStyle={{ minWidth: minInnerWidth }}
			activeInnerStyle={{ width: innerWidth }}
			stickyEnabled={oneMoreCandidates}
			stickyTop={stickyTop - 11}
			stickyBottomBoundary="[data-second-from-bottom='true']"
			isHorizontalScrollbarBetweenSticky={true}
		>
			<Sticky
				top={stickyTop}
				innerZ={1}
				bottomBoundary="[data-second-from-bottom='true']"
				enabled={oneMoreCandidates}
			>
				<div>
					<PartNumberSpecHeader
						specList={nonStandardSpecList}
						relatedLinkFrameFlag={relatedLinkFrameFlag}
						rohsFrameFlag={rohsFrameFlag}
						innerRef={headerRef}
						height={headerHeight}
					/>
				</div>
			</Sticky>
			<table className={styles.tableBase}>
				<tbody ref={bodyRef}>
					{specValueMapList.map(({ specValues, partNumber }, index) => (
						<tr
							key={index}
							style={{ height: eachRowHeight[index] }}
							{...(oneMoreCandidates && {
								className: styles.dataRow,
								'data-hover': cursor === index,
								onClick: () => rowActions.onClick(index),
								onMouseOver: () => rowActions.onMouseOver(index),
								onMouseLeave: rowActions.onMouseLeave,
							})}
						>
							<PartNumberSpecCells
								specList={nonStandardSpecList}
								specValues={specValues}
								relatedLinkFrameFlag={relatedLinkFrameFlag}
								relatedLinkList={partNumber.relatedLinkList}
								rohsFrameFlag={rohsFrameFlag}
								rohsFlag={partNumber.rohsFlag}
								minQuantity={partNumber.minQuantity}
								piecesPerPackage={partNumber.piecesPerPackage}
							/>
						</tr>
					))}
				</tbody>
			</table>
		</HorizontalScrollbarContainer>
	);
};
PartNumberSpecColumns.displayName = 'PartNumberSpecColumns';

import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import React, {
	Fragment,
	MouseEvent,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AlterationSpecList } from './AlterationSpecList';
import styles from './SpecPanel.module.scss';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { SpecList } from '@/components/mobile/pages/ProductDetail/templates/Complex/SpecPanel/SpecList';
import { AlertMessage } from '@/components/mobile/ui/messages/AlertMessage';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Flag } from '@/models/api/Flag';
import {
	AlterationSpec,
	CadType,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { getHeight } from '@/utils/dom';
import { unfixedSpecPartNumberParts } from '@/utils/domain/partNumber';
import { getSeriesNameDisp } from '@/utils/domain/series';
import { notEmpty } from '@/utils/predicate';
import { appendZeroWidthSpaceToCommas } from '@/utils/string';

type Props = {
	series: Series;
	// この partNumber は確定型番とは限らない。partNumberList が 1 件になった時の partNumber。ect-web-th の通り…。
	partNumber?: string;
	// こちらは確定型番
	completedPartNumber?: string;
	/** part number total count */
	totalCount?: number;
	specList: PartNumberSpec[];
	cadTypeList: CadType[];
	alterationNoticeText?: string;
	cautionList?: string[];
	noticeList?: string[];
	alterationSpecList: AlterationSpec[];
	completeFlag: Flag;
	onChange: (payload: ChangePayload) => void;
	onClose: () => void;
	onClearFilter: () => void;
	onClickPartNumberCount: () => void;
	onConfirm: () => void;
};

/**
 * Spec panel
 */
export const SpecPanel: React.VFC<Props> = ({
	series,
	partNumber,
	completedPartNumber,
	totalCount = 0,
	specList,
	cadTypeList,
	alterationNoticeText,
	cautionList = [],
	noticeList = [],
	alterationSpecList,
	completeFlag,
	onChange,
	onClose,
	onClearFilter,
	onClickPartNumberCount,
	onConfirm,
}) => {
	const { t } = useTranslation();
	const specListRef = useRef<HTMLUListElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const seriesNameDisp = getSeriesNameDisp(series, t);
	const partNumberParts = unfixedSpecPartNumberParts(partNumber ?? '');
	const isUnfixedSpec = Flag.isFalse(completeFlag) && totalCount === 1;

	const [height, setHeight] = useState<number>();
	const bottomButtonBoxRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!bottomButtonBoxRef.current) {
			return;
		}
		const boxHeight = getHeight(bottomButtonBoxRef.current) ?? 0;
		setHeight(boxHeight);
	}, [bottomButtonBoxRef, cautionList, noticeList]);

	useOnMounted(() => {
		if (panelRef.current) {
			disableBodyScroll(panelRef.current, { allowTouchMove: () => true });
			return () => clearAllBodyScrollLocks();
		}
	});

	const handleClearFilter = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClearFilter();
		},
		[onClearFilter]
	);

	const handleClose = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClose();
		},
		[onClose]
	);

	const handleClickShowPartNumberList = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onClickPartNumberCount();
		},
		[onClickPartNumberCount]
	);

	const handleConfirm = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			onConfirm();
		},
		[onConfirm]
	);

	return (
		<div className={styles.container}>
			<p
				className={styles.seriesName}
				dangerouslySetInnerHTML={{ __html: seriesNameDisp }}
			/>
			<div
				className={styles.contents}
				style={{
					height: height != null ? `calc(100% - ${height}px)` : undefined,
				}}
			>
				<div className={styles.headerBox}>
					<h2 className={styles.filterHeading}>
						{t(
							'mobile.pages.productDetail.templates.complex.specPanel.configure'
						)}
					</h2>
					<div className={styles.buttonBox}>
						<a href="#" className={styles.button} onClick={handleClearFilter}>
							{t(
								'mobile.pages.productDetail.templates.complex.specPanel.clearAll'
							)}
						</a>
						<a href="#" className={styles.button} onClick={handleClose}>
							{t(
								'mobile.pages.productDetail.templates.complex.specPanel.close'
							)}
						</a>
					</div>
				</div>

				<div className={styles.panel} ref={panelRef}>
					<SpecList
						ref={specListRef}
						specList={specList}
						cadTypeList={cadTypeList}
						onChange={onChange}
						className={styles.specList}
					/>
					<AlterationSpecList
						alterationNoticeText={alterationNoticeText}
						alterationSpecList={alterationSpecList}
						onChange={onChange}
						className={styles.alterationSpecList}
					/>
				</div>
				<div className={styles.bottomButtonBox} ref={bottomButtonBoxRef}>
					{(notEmpty(cautionList) || notEmpty(noticeList)) && (
						<ul className={styles.alertWrap}>
							{notEmpty(cautionList) &&
								cautionList.map((caution, index) => (
									<li key={index}>
										<AlertMessage>{caution}</AlertMessage>
									</li>
								))}
							{notEmpty(noticeList) &&
								noticeList.map((notice, index) => (
									<li key={index}>
										<AlertMessage>{notice}</AlertMessage>
									</li>
								))}
						</ul>
					)}
					<div className={styles.partNumberBox}>
						{!partNumber ? (
							<a
								href="#"
								className={styles.partNumber}
								onClick={handleClickShowPartNumberList}
							>
								<Trans i18nKey="mobile.pages.productDetail.templates.complex.partNumberTotalCount">
									<div className={styles.count}>{{ totalCount }}</div>
								</Trans>
							</a>
						) : (
							<div className={styles.partNumber}>
								{isUnfixedSpec ? (
									<p className={styles.partNumberGuide}>
										{partNumberParts.map((partNumberPart, index) => {
											return (
												<Fragment key={index}>
													{partNumberPart.unfixedSpec ? (
														<span
															className={styles.unfixed}
															dangerouslySetInnerHTML={{
																__html: appendZeroWidthSpaceToCommas(
																	partNumberPart.part
																),
															}}
														/>
													) : (
														<span>{partNumberPart.part}</span>
													)}
												</Fragment>
											);
										})}
									</p>
								) : (
									partNumber
								)}
							</div>
						)}
						{!completedPartNumber ? (
							<div className={styles.notConfirmed}>
								<Trans i18nKey="mobile.pages.productDetail.templates.complex.specPanel.notConfirmed">
									<div />
									<div />
									<div className={styles.small} />
								</Trans>
							</div>
						) : (
							<a href="#" className={styles.confirm} onClick={handleConfirm}>
								{t(
									'mobile.pages.productDetail.templates.complex.specPanel.confirm'
								)}
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
SpecPanel.displayName = 'SpecPanel';

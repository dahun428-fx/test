import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import { CSSTransition } from 'react-transition-group';
import styles from './SpecPanel.module.scss';
import { SpecCode, SpecValues } from './types';
import { AlterationSpecList } from '@/components/pc/pages/ProductDetail/templates/Complex/SpecPanel/AlterationSpecList';
import { SpecList } from '@/components/pc/pages/ProductDetail/templates/Complex/SpecPanel/SpecList';
import { Button } from '@/components/pc/ui/buttons';
import {
	AlterationSpec,
	CadType,
	DaysToShip,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { getHeight } from '@/utils/dom';
import { SendLogPayload } from '@/utils/domain/spec/types';

type Props = {
	specList: PartNumberSpec[];
	daysToShipList: DaysToShip[];
	cadTypeList: CadType[];
	progressPercent: number;
	alterationNoticeText?: string;
	alterationSpecList: AlterationSpec[];
	focusesAlterationSpecs: boolean;
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	showStandardSpecs: () => void;
	onClearFilter: () => void;
	sendLog: (payload: SendLogPayload) => void;
};

/**
 * Spec panel
 */
export const SpecPanel: React.VFC<Props> = ({
	specList,
	daysToShipList,
	cadTypeList,
	progressPercent,
	alterationNoticeText,
	alterationSpecList,
	focusesAlterationSpecs,
	showStandardSpecs,
	onChange,
	onClearFilter,
	sendLog,
}) => {
	const { t } = useTranslation();
	const specListRef = useRef<HTMLUListElement>(null);
	const headerBoxRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);
	const [status, setStatus] = useState<Sticky.StatusCode>(Sticky.STATUS_FIXED);
	const containerRef = useRef<HTMLDivElement>(null);
	const headerBoxHeight = getHeight(headerBoxRef) ?? 0;
	const progressHeight = getHeight(progressRef) ?? 0;

	const isConfigured = progressPercent === 100;

	useLayoutEffect(() => {
		if (!containerRef.current) {
			return;
		}

		if (status === Sticky.STATUS_FIXED) {
			containerRef.current.style.height = '100vh';
		} else {
			containerRef.current.style.height = '';
		}
	}, [status]);

	return (
		<Sticky
			bottomBoundary="#productContents"
			innerClass={styles.sticky}
			onStateChange={sticky => setStatus(sticky.status)}
		>
			<div className={styles.container} ref={containerRef}>
				<div className={styles.headerBox} ref={headerBoxRef}>
					<h2
						className={classNames(
							isConfigured
								? styles.filterHeadingConfigured
								: styles.filterHeading
						)}
					>
						{isConfigured
							? t('pages.productDetail.complex.specPanel.configured')
							: t('pages.productDetail.complex.specPanel.configure')}
					</h2>
					<button className={styles.clearAll} onClick={onClearFilter}>
						{t('pages.productDetail.complex.specPanel.clearAll')}
					</button>
				</div>
				<div className={styles.progress} ref={progressRef}>
					<div
						className={styles.progressPercent}
						data-progress-percent={progressPercent}
					/>
				</div>
				<div
					className={styles.panel}
					id="specPanel"
					style={{
						height: `${
							window.innerHeight - headerBoxHeight - progressHeight
						}px`,
					}}
				>
					<CSSTransition
						in={!focusesAlterationSpecs}
						timeout={500}
						nodeRef={specListRef}
						classNames={{
							enter: styles.enter,
							enterActive: styles.enterActive,
							exit: styles.exit,
							exitActive: styles.exitActive,
						}}
						unmountOnExit
					>
						<SpecList
							ref={specListRef}
							className={styles.specList}
							specList={specList}
							daysToShipList={daysToShipList}
							cadTypeList={cadTypeList}
							onChange={onChange}
							sendLog={sendLog}
						/>
					</CSSTransition>

					{focusesAlterationSpecs && (
						<div className={styles.showSpecWrap}>
							<Button size="m" onClick={showStandardSpecs}>
								{t('pages.productDetail.complex.specPanel.showSpecList')}
							</Button>
						</div>
					)}

					<AlterationSpecList
						alterationNoticeText={alterationNoticeText}
						alterationSpecList={alterationSpecList}
						onChange={onChange}
						sendLog={sendLog}
					/>
				</div>
			</div>
		</Sticky>
	);
};
SpecPanel.displayName = 'SpecPanel';

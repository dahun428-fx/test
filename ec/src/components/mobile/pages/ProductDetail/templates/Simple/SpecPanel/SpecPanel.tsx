import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import classNames from 'classnames';
import React, { useCallback, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PartNumberList } from './PartNumberList';
import { Progress } from './Progress';
import { SpecList } from './SpecList';
import styles from './SpecPanel.module.scss';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { QuantityField } from '@/components/mobile/pages/ProductDetail/QuantityField';
import { OverlayLoader } from '@/components/mobile/ui/loaders';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import {
	CadType,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

type Props = {
	specList: PartNumberSpec[];
	cadTypeList: CadType[];
	partNumber?: string;
	totalCount?: number;
	maxGuideCount?: number;
	guideCount?: number;
	completeFlag?: Flag;
	checking: boolean;
	quantity: number | null;
	orderUnit?: number;
	onChangeQuantity: (value: number | null) => void;
	onChange: (payload: ChangePayload) => void;
	onClose: () => void;
	onReset: () => void;
	onConfirm: () => void;
};

/**
 * Spec panel
 */
export const SpecPanel: React.VFC<Props> = ({
	specList,
	cadTypeList,
	partNumber,
	totalCount,
	maxGuideCount = 0,
	guideCount = 0,
	completeFlag,
	checking,
	quantity,
	orderUnit,
	onChangeQuantity,
	onChange,
	onClose,
	onReset,
	onConfirm,
}) => {
	const { t } = useTranslation();
	const panelRef = useRef<HTMLDivElement>(null);
	const { toggle: toggleShowsSpecList, bool: showsSpecList } = useBoolState(
		!!specList.length
	);
	const { showMessage } = useMessageModal();

	useOnMounted(() => {
		if (panelRef.current) {
			disableBodyScroll(panelRef.current, { allowTouchMove: () => true });
			return () => clearAllBodyScrollLocks();
		}
	});

	const confirmable = useMemo(
		() => Flag.isTrue(completeFlag) || maxGuideCount - guideCount === 0,
		[completeFlag, guideCount, maxGuideCount]
	);

	const handleClickToggleShowsSpecList = useCallback(() => {
		if (!!specList.length) {
			toggleShowsSpecList();
		}
	}, [specList.length, toggleShowsSpecList]);

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleConfirm = useCallback(() => {
		if (!confirmable) {
			showMessage(
				t(
					'mobile.pages.productDetail.templates.simple.specPanel.partNumberIsNotCompleted'
				)
			);
			return;
		}
		onConfirm();
	}, [confirmable, onConfirm, showMessage, t]);

	return (
		<div className={styles.container}>
			<div className={styles.blank} onClick={handleClose}></div>
			<div className={styles.panel} ref={panelRef}>
				<button className={styles.close} onClick={handleClose} />
				<div className={styles.main}>
					<Progress maxGuideCount={maxGuideCount} guideCount={guideCount} />
					<div className={styles.partNumberCountMessage}>
						{confirmable ? (
							t(
								'mobile.pages.productDetail.templates.simple.specPanel.confirmableMessage'
							)
						) : (
							<Trans
								i18nKey="mobile.pages.productDetail.templates.simple.specPanel.thereAreMultiplePartNumbers"
								values={{ count: maxGuideCount - guideCount }}
							>
								<span className={styles.partNumberCount} />
							</Trans>
						)}
					</div>
					<div
						className={classNames(styles.panelSwitch, {
							[String(styles.panelSwitchActive)]: !showsSpecList,
						})}
						onClick={handleClickToggleShowsSpecList}
					>
						{totalCount !== 1 ? (
							<Trans
								i18nKey="mobile.pages.productDetail.templates.simple.specPanel.partNumberCount"
								values={{ totalCount }}
							>
								<span className={styles.panelSwitchAccent} />
							</Trans>
						) : (
							<span className={styles.panelSwitchAccent}>{partNumber}</span>
						)}
					</div>
					<div className={styles.orderQty}>
						<span className={styles.quantityLabel}>
							{t(
								'mobile.pages.productDetail.templates.simple.specPanel.quantityLabel'
							)}
						</span>
						<QuantityField
							theme="sub"
							size="s"
							step={orderUnit}
							value={quantity}
							onChange={onChangeQuantity}
						/>
						<div className={styles.confirmGuide}>
							{t(
								'mobile.pages.productDetail.templates.simple.specPanel.confirmGuide'
							)}
						</div>
					</div>
					<div className={styles.panelBox}>
						{showsSpecList ? (
							<SpecList
								specList={specList}
								cadTypeList={cadTypeList}
								onChange={onChange}
							/>
						) : (
							<PartNumberList />
						)}
					</div>
				</div>
				<div className={styles.buttonBox}>
					{showsSpecList ? (
						<>
							<button className={styles.resetButton} onClick={onReset}>
								{t(
									'mobile.pages.productDetail.templates.simple.specPanel.reset'
								)}
							</button>
							<button className={styles.confirmButton} onClick={handleConfirm}>
								{t(
									'mobile.pages.productDetail.templates.simple.specPanel.confirm'
								)}
							</button>
						</>
					) : (
						<button
							className={styles.fullConfirmButton}
							onClick={handleConfirm}
						>
							{t(
								'mobile.pages.productDetail.templates.simple.specPanel.confirm'
							)}
						</button>
					)}
				</div>
			</div>
			{checking && <OverlayLoader />}
		</div>
	);
};
SpecPanel.displayName = 'SpecPanel';

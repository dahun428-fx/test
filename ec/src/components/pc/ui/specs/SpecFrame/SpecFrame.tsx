import React, {
	forwardRef,
	PropsWithChildren,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import styles from './SpecFrame.module.scss';
import { InformationMessage } from '@/components/pc/ui/messages/InformationMessage';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { getSpecName } from '@/utils/domain/spec';

type Props = {
	specName: string;
	specUnit?: string;
	openCloseType?: OpenCloseType;
	specNoticeText?: string;
	selectedFlag?: Flag;
	refinedFlag?: Flag;
	maxHeight?: boolean;
	onClear?: () => void;
};

/**
 *  Frame of Spec select or input field
 */
export const SpecFrame = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
	(
		{
			children,
			specName,
			specUnit,
			openCloseType = OpenCloseType.DISABLE,
			specNoticeText,
			selectedFlag = Flag.FALSE,
			refinedFlag = selectedFlag,
			maxHeight = true,
			onClear,
		},
		ref
	) => {
		const { t } = useTranslation();

		const contentsRef = useRef<HTMLDivElement>(null);

		const { bool: isOpen, toggle } = useBoolState(
			openCloseType === OpenCloseType.OPEN ||
				openCloseType === OpenCloseType.DISABLE
		);

		// contents closable?
		const closable = openCloseType !== OpenCloseType.DISABLE;

		// contents scroll height
		const [height, setHeight] = useState<number>(0);

		const handleClickClear = useCallback(() => {
			onClear?.();
		}, [onClear]);

		useLayoutEffect(() => {
			if (contentsRef.current) {
				if (isOpen) {
					setHeight(contentsRef.current.scrollHeight);
				} else {
					setHeight(0);
				}
			}
		}, [isOpen, children]);

		return (
			<div
				className={styles.frame}
				data-spec-refined={Flag.isTrue(refinedFlag)}
				aria-expanded={closable ? isOpen : undefined}
				ref={ref}
			>
				<h4 className={styles.heading}>
					<span
						className={styles.specName}
						onClick={() => closable && toggle()}
						dangerouslySetInnerHTML={{
							__html: getSpecName({ specName, specUnit }),
						}}
					/>
				</h4>
				<CSSTransition in={isOpen} timeout={300} nodeRef={contentsRef}>
					<div
						className={styles.contents}
						ref={contentsRef}
						style={{ maxHeight: maxHeight ? `${height}px` : '' }}
					>
						{specNoticeText && (
							<InformationMessage className={styles.specNoticeText}>
								{specNoticeText}
							</InformationMessage>
						)}
						{children}
						{Flag.isTrue(selectedFlag) && (
							<div className={styles.clearWrap}>
								<button className={styles.clear} onClick={handleClickClear}>
									{t('components.ui.specs.specFrame.clear')}
								</button>
							</div>
						)}
					</div>
				</CSSTransition>
			</div>
		);
	}
);
SpecFrame.displayName = 'SpecFrame';

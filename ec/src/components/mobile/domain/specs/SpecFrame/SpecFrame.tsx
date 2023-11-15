import React, {
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './SpecFrame.module.scss';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { getHeight } from '@/utils/dom';
import { getSpecName } from '@/utils/domain/spec';

/**
 * Clear selected items の高さ (アニメーション用)
 * - NOTE: デザイン変更時に変更の必要がないか留意すること
 */
const CLEAR_LINK_HEIGHT = 100;

type Props = {
	specName: string;
	specUnit?: string;
	openCloseType?: OpenCloseType;
	selectedFlag?: Flag;
	onClear?: () => void;
	children: ReactNode;
};

export const SpecFrame: React.FC<Props> = ({
	children,
	specName,
	specUnit,
	selectedFlag = Flag.FALSE,
	onClear,
	openCloseType = OpenCloseType.DISABLE,
}) => {
	const { t } = useTranslation();

	const [showsClear, setShowsClear] = useState(false);

	const { bool: isOpen, toggle } = useBoolState(
		openCloseType !== OpenCloseType.CLOSE
	);
	const [height, setHeight] = useState<number>();
	const contentsRef = useRef<HTMLDivElement>(null);

	const collapsible = openCloseType !== OpenCloseType.DISABLE;
	const ariaExpanded = collapsible ? isOpen : undefined;
	const ariaHidden = collapsible ? !isOpen : undefined;

	useEffect(() => {
		if (contentsRef.current && collapsible) {
			if (isOpen) {
				setHeight(getHeight(contentsRef.current));
				const observer = new ResizeObserver(([entry]) => {
					if (entry) {
						setHeight(entry.contentRect.height);
					}
				});
				observer.observe(contentsRef.current);
				return () => observer.disconnect();
			}
			setHeight(0);
		}
	}, [collapsible, isOpen]);

	useEffect(() => {
		setShowsClear(Flag.isTrue(selectedFlag));
	}, [selectedFlag]);

	const handleClear = useCallback(() => {
		setShowsClear(false);
		onClear && onClear();
	}, [onClear]);

	return (
		<div aria-expanded={ariaExpanded} className={styles.frame}>
			<div className={styles.header}>
				<h4
					className={styles.heading}
					onClick={collapsible ? toggle : undefined}
					dangerouslySetInnerHTML={{
						__html: getSpecName({ specName, specUnit }),
					}}
				/>
				<span
					className={styles.clear}
					onClick={handleClear}
					style={{
						maxHeight: showsClear ? CLEAR_LINK_HEIGHT : 0,
					}}
				>
					{t('mobile.components.domain.specs.specFrame.clear')}
				</span>
			</div>
			<div
				className={styles.contents}
				style={{ maxHeight: height != null ? `${height}px` : undefined }}
				aria-hidden={ariaHidden}
			>
				<div ref={contentsRef}>{children}</div>
			</div>
		</div>
	);
};
SpecFrame.displayName = 'SpecFrame';

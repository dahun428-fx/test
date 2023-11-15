import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './SpecFrame.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { getHeight } from '@/utils/dom';
import { getSpecName } from '@/utils/domain/spec';

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
				{Flag.isTrue(selectedFlag) && (
					<Button
						theme="default-sub-tiny"
						className={styles.clear}
						onClick={onClear}
					>
						{t('pages.productDetail.simple.specFilter.clear')}
					</Button>
				)}
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

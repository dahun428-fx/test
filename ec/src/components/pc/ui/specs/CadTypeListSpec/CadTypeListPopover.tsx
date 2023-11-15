import classNames from 'classnames';
import React, { RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadTypeListPopover.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { PopoverTransition } from '@/components/pc/ui/specs/SpecPopover/PopoverTransition';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { usePortal } from '@/hooks/ui/usePortal';

type Props = {
	isOpen: boolean;
	selected?: boolean;
	title: string;
	top: number;
	className: string;
	triggerRef: RefObject<HTMLElement>;
	popoverRef: RefObject<HTMLDivElement>;
	onCancel: () => void;
	onClear: () => void;
};

/** Cad type list popover */
export const CadTypeListPopover: React.FC<Props> = ({
	isOpen,
	selected,
	title,
	top,
	className,
	children,
	triggerRef,
	popoverRef,
	onCancel,
	onClear,
}) => {
	const { Portal } = usePortal();
	const [t] = useTranslation();

	const handleCancel = useCallback(() => {
		onCancel();
		triggerRef.current?.focus?.();
	}, [onCancel, triggerRef]);

	useOuterClick([popoverRef, triggerRef], onCancel);

	return (
		<Portal>
			<PopoverTransition isOpen={isOpen}>
				<div
					className={classNames(styles.container, className)}
					ref={popoverRef}
					style={{ top }}
				>
					<div className={styles.header}>
						<h5 className={styles.heading}>{title}</h5>
						<button className={styles.close} onClick={handleCancel}>
							close
						</button>
					</div>
					<div>
						<div className={styles.body}>
							<div className={styles.contents}>{children}</div>
						</div>
						{selected && (
							<div className={styles.clearBox}>
								<div className={styles.clearOuter}>
									<div className={styles.clearWrap}>
										<Button theme="default-sub-tiny" onClick={onClear}>
											{t('components.ui.specs.cadTypeListSpec.clear')}
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</PopoverTransition>
		</Portal>
	);
};

CadTypeListPopover.displayName = 'CadTypeListPopover';

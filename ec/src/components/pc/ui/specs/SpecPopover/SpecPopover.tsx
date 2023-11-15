import classNames from 'classnames';
import React, {
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import { Button } from '@/components/pc/ui/buttons';
import { InformationMessage } from '@/components/pc/ui/messages/InformationMessage';
import { PopoverTransition } from '@/components/pc/ui/specs/SpecPopover/PopoverTransition';
import styles from '@/components/pc/ui/specs/SpecPopover/SpecPopover.module.scss';
import { SpecPopoverAside } from '@/components/pc/ui/specs/SpecPopover/SpecPopoverAside';
import { SpecDetail } from '@/components/pc/ui/specs/SpecPopover/SpecPopoverAside/SpecPopoverAside';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { usePortal } from '@/hooks/ui/usePortal';

type Props = {
	isOpen: boolean;
	selected?: boolean;
	title: string;
	specNoticeText?: string;
	top: number;
	triggerRef: RefObject<HTMLElement>;
	// FIXME: I want to use "ref" with forwardRef. (and useOuterClick...)
	popoverRef: RefObject<HTMLDivElement>;
	onCancel: () => void;
	onClear: () => void;
	className: string;
	spec: SpecDetail;
};

/**
 * Spec popover
 */
export const SpecPopover: React.FC<Props> = ({
	isOpen,
	selected,
	title,
	specNoticeText,
	top,
	triggerRef,
	popoverRef,
	onCancel,
	onClear,
	className,
	children,
	spec,
}) => {
	const { Portal } = usePortal();
	const headingRef = useRef<HTMLHeadingElement>(null);

	const handleCancel = useCallback(() => {
		onCancel();
		triggerRef.current?.focus?.();
	}, [onCancel, triggerRef]);

	useEffect(() => {
		if (isOpen) {
			headingRef.current?.focus?.();
		}
	}, [isOpen]);

	useOuterClick(
		useMemo(() => [popoverRef, triggerRef], [popoverRef, triggerRef]),
		onCancel
	);

	return (
		<Portal>
			<PopoverTransition isOpen={isOpen}>
				<div
					className={classNames(styles.container, className)}
					ref={popoverRef}
					style={{ top }}
				>
					<div className={styles.header}>
						<h5
							className={styles.heading}
							dangerouslySetInnerHTML={{ __html: title }}
							tabIndex={-1}
							ref={headingRef}
						/>
						<button className={styles.close} onClick={handleCancel}>
							close
						</button>
					</div>
					<div className={styles.body}>
						<div className={styles.main}>
							{specNoticeText && (
								<InformationMessage className={styles.specNoticeText}>
									{specNoticeText}
								</InformationMessage>
							)}
							{children}
							{selected && (
								<div className={styles.clearOuter}>
									<div className={styles.clearWrap}>
										<Button theme="default-sub-tiny" onClick={() => onClear()}>
											{/* TODO: i18n */}
											Clear
										</Button>
									</div>
								</div>
							)}
						</div>
						<SpecPopoverAside className={styles.aside} spec={spec} />
					</div>
				</div>
			</PopoverTransition>
		</Portal>
	);
};
SpecPopover.displayName = 'SpecPopover';

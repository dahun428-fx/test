import classNames from 'classnames';
import React, {
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import { Button } from '@/components/pc/ui/buttons';
import styles from '@/components/pc/ui/specs/CategoryPopover/CategoryPopover.module.scss';
import { PopoverTransition } from '@/components/pc/ui/specs/SpecPopover/PopoverTransition';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { usePortal } from '@/hooks/ui/usePortal';

type Props = {
	isOpen: boolean;
	selected?: boolean;
	title: string;
	top: number;
	triggerRef: RefObject<HTMLElement>;
	// FIXME: I want to use "ref" with forwardRef. (and useOuterClick...)
	popoverRef: RefObject<HTMLDivElement>;
	onCancel: () => void;
	onClear: () => void;
	className: string;
};

/**
 * Category popover
 */
export const CategoryPopover: React.FC<Props> = ({
	isOpen,
	selected,
	title,
	top,
	triggerRef,
	popoverRef,
	onCancel,
	onClear,
	className,
	children,
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
					</div>
				</div>
			</PopoverTransition>
		</Portal>
	);
};
CategoryPopover.displayName = 'CategoryPopover';

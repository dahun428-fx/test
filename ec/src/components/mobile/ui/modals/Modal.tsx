import classNames from 'classnames';
import React, {
	ReactNode,
	useContext,
	useRef,
	useEffect,
	useState,
	useCallback,
} from 'react';
import styles from './Modal.module.scss';
import { ModalTransition } from './ModalTransition';
import { Context } from './context';
import { usePortal } from '@/hooks/ui/usePortal';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	isOpen?: boolean;
	title?: string | ReactNode;
	isFullWidth?: boolean;
	className?: string;
	onCancel?: () => void;
};

type Position = 'absolute' | 'fixed';

const HORIZONTAL_SPACE = 15;

/**
 * Modal base component.
 */
export const Modal: React.FC<Props> = ({
	children,
	title,
	isFullWidth = true,
	className,
	...props
}) => {
	const context = useContext(Context);
	const isOpen = props.isOpen ?? context.isOpen;
	const onCancel = props.onCancel ?? context.close;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const [position, setPosition] = useState<Position>('absolute');
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);

	// Should be given via Props or Context.
	assertNotNull(isOpen);
	assertNotNull(onCancel);

	const { Portal } = usePortal();
	const focusTargetRef = useRef<HTMLDivElement | null>(null);

	const calculateModalPosition = useCallback(() => {
		if (!wrapperRef.current) {
			return;
		}

		let modalWidth = 0;

		if (window.innerWidth > 370) {
			// max possible width of modal = 340
			modalWidth = 340;
		} else {
			// left margin = right margin = 15px
			modalWidth = window.innerWidth - HORIZONTAL_SPACE * 2;
		}

		if (window.innerHeight > wrapperRef.current.offsetHeight) {
			setPosition('fixed');
		} else {
			setPosition('absolute');
			setTop(window.scrollY + HORIZONTAL_SPACE);
		}

		setLeft(
			isFullWidth ? HORIZONTAL_SPACE : (window.innerWidth - modalWidth) / 2
		);

		setWidth(
			isFullWidth ? window.innerWidth - HORIZONTAL_SPACE * 2 : modalWidth
		);
	}, [isFullWidth]);

	const handleWindowResize = useCallback(() => {
		if (isOpen) {
			calculateModalPosition();
		}
	}, [calculateModalPosition, isOpen]);

	useEffect(() => {
		if (isOpen) {
			setWidth(window.innerWidth);
			focusTargetRef.current?.focus();

			calculateModalPosition();
		}

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [calculateModalPosition, handleWindowResize, isOpen]);

	//=======================================================================

	return (
		<Portal>
			<ModalTransition isOpen={isOpen}>
				<div
					className={styles.overlay}
					onClick={event => {
						// NOTE: avoid outer click event to be captured when closing modal
						// Ex: Do not hide part number search suggestion after close modal.
						event.stopPropagation();
						onCancel();
					}}
				/>
				<div
					className={classNames(styles.wrapper, {
						[String(styles.fullWidthWrapper)]: isFullWidth,
					})}
					ref={wrapperRef}
					style={{
						width,
						opacity: isOpen ? 1 : 0,
						position,
						top: position === 'fixed' ? '50%' : top,
						transform: position === 'fixed' ? 'translateY(-50%)' : undefined,
						left,
					}}
				>
					<div
						role="dialog"
						aria-modal={true}
						className={classNames(styles.modal, className)}
					>
						{title && <h3 className={styles.title}>{title}</h3>}
						{/* first focus element on open modal. */}
						{/* https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-7 */}
						<div tabIndex={-1} ref={focusTargetRef} />
						{children}
					</div>
				</div>
			</ModalTransition>
		</Portal>
	);
};
Modal.displayName = 'Modal';

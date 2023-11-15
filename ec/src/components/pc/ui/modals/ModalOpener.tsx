import React, { useContext } from 'react';
import styles from './ModalProvider.module.scss';
import { Context } from './context';

type Props = {
	disabled?: boolean;
	className?: string;
};

/**
 * Modal open trigger
 * Uses with ModalProvider
 */
export const ModalOpener: React.FC<Props> = ({
	children,
	disabled,
	className,
}) => {
	const { open } = useContext(Context);

	const handleClick = () => {
		disabled || open();
	};

	return (
		<div
			className={className ?? styles.wrapper}
			aria-haspopup={!disabled && 'dialog'}
			onClick={handleClick}
		>
			{children}
		</div>
	);
};
ModalOpener.displayName = 'ModalOpener';

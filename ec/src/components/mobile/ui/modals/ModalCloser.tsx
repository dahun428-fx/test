import React, { useContext } from 'react';
import styles from './ModalProvider.module.scss';
import { Context } from './context';

type Props = {
	className?: string;
};

/**
 * Modal close trigger on click
 * Uses with ModalProvider
 */
export const ModalCloser: React.FC<Props> = ({ children, className }) => {
	const { close } = useContext(Context);
	return (
		<div className={className ?? styles.wrapper} onClick={close}>
			{children}
		</div>
	);
};
ModalCloser.displayName = 'ModalCloser';

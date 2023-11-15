import React, { useCallback, useState } from 'react';
import { Context } from './context';

/**
 * Modal provider
 */
export const ModalProvider: React.FC = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => {
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<Context.Provider value={{ isOpen, open, close }}>
			{children}
		</Context.Provider>
	);
};
ModalProvider.displayName = 'ModalProvider';

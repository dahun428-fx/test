import React from 'react';
import { UniversalLoaderProvider } from '@/components/mobile/ui/loaders/UniversalLoaderProvider';
import { MessageModalProvider } from '@/components/mobile/ui/modals/MessageModal';
import { ModalContentProvider } from '@/components/mobile/ui/modals/Modal.hooks';

/**
 * Context providers
 */
export const ContextProviders: React.FC = ({ children }) => {
	return (
		<UniversalLoaderProvider>
			<ModalContentProvider>
				<MessageModalProvider>{children}</MessageModalProvider>
			</ModalContentProvider>
		</UniversalLoaderProvider>
	);
};
ContextProviders.displayName = 'ContextProviders';

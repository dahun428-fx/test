import React from 'react';
import { UniversalLoaderProvider } from '@/components/pc/ui/loaders/UniversalLoaderProvider';
import { ConfirmModalProvider } from '@/components/pc/ui/modals/ConfirmModal';
import { MessageModalProvider } from '@/components/pc/ui/modals/MessageModal';
import { ModalContentProvider } from '@/components/pc/ui/modals/Modal.hooks';
import { MessageToastProvider } from '@/components/pc/ui/toasts/MessageToast';
import { TooltipProvider } from '@/components/pc/ui/tooltips';

/**
 * Context providers
 */
export const ContextProviders: React.FC = ({ children }) => {
	return (
		<UniversalLoaderProvider>
			<TooltipProvider>
				<MessageModalProvider>
					<ConfirmModalProvider>
						<ModalContentProvider>
							<MessageToastProvider>{children}</MessageToastProvider>
						</ModalContentProvider>
					</ConfirmModalProvider>
				</MessageModalProvider>
			</TooltipProvider>
		</UniversalLoaderProvider>
	);
};
ContextProviders.displayName = 'ContextProviders';

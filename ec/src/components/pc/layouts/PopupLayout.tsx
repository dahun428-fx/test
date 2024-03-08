import RootErrorBoundary from '@/components/pc/boundaries/RootErrorBoundary';
import { ErrorHandler } from '@/components/pc/error/ErrorHandler';
import { ContextProviders } from '@/components/pc/functional/ContextProviders';
import { Effective } from '@/components/pc/functional/Effective';
import { MessageModalController } from '@/components/pc/ui/modals/MessageModal';
import { ModalController } from '@/components/pc/ui/modals/Modal.hooks';

export const PopupLayout: React.FC = ({ children }) => {
	return (
		<RootErrorBoundary>
			<ContextProviders>
				<Effective />
				<div>{children}</div>
				<ErrorHandler />
				<ModalController />
				<MessageModalController />
			</ContextProviders>
		</RootErrorBoundary>
	);
};

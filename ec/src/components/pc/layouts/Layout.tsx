import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import styles from './Layout.module.scss';
import { BackToTop } from './footers/BackToTop';
import { CadDownloadStatusBalloon } from './footers/CadDownloadStatusBalloon';
import { Footer } from './footers/Footer';
import { Header } from './headers/Header';
import RootErrorBoundary from '@/components/pc/boundaries/RootErrorBoundary';
import { ErrorHandler } from '@/components/pc/error/ErrorHandler';
import { ContextProviders } from '@/components/pc/functional/ContextProviders';
import { Effective } from '@/components/pc/functional/Effective';
import { ChatPlus } from '@/components/pc/layouts/footers/ChatPlus';
import { FloatingBanner } from '@/components/pc/ui/banners/FloatingBanner/FloatingBanner';
import { UniversalLoaderController } from '@/components/pc/ui/loaders/UniversalLoader.context';
import { ConfirmModalController } from '@/components/pc/ui/modals/ConfirmModal';
import { MessageModalController } from '@/components/pc/ui/modals/MessageModal';
import { ModalController } from '@/components/pc/ui/modals/Modal.hooks';
import { MessageToastController } from '@/components/pc/ui/toasts/MessageToast';
import { TooltipController } from '@/components/pc/ui/tooltips';
import { OrderStatusPanel } from './headers/Header/OrderStatus';

const DevTool =
	process.env.NODE_ENV === 'development' &&
	// eslint-disable-next-line @typescript-eslint/ban-types
	dynamic<{}>(
		() =>
			import('@/components/shared/dev/DevTool').then(module => module.DevTool),
		{ ssr: false }
	);

/**
 * Default layout for PC
 */
export const Layout: React.FC = ({ children }) => {
	const rootRef = useRef<HTMLDivElement>(null);
	return (
		<RootErrorBoundary>
			<ContextProviders>
				<Effective />
				<div className={styles.layout} ref={rootRef}>
					<Header />
					<div className={styles.main}>
						<OrderStatusPanel />
						<div className={styles.childrenWrapper}>{children}</div>
					</div>
					<div className={styles.rightSideFloating}>
						<ChatPlus />
						<BackToTop layoutRootRef={rootRef} />
						<CadDownloadStatusBalloon />
					</div>
					<Footer />
					<FloatingBanner />
				</div>
				<ErrorHandler />
				<ModalController />
				<ConfirmModalController />
				<MessageModalController />
				<MessageToastController />
				<UniversalLoaderController />
				<TooltipController />
				{DevTool && <DevTool />}
			</ContextProviders>
		</RootErrorBoundary>
	);
};
Layout.displayName = 'Layout';

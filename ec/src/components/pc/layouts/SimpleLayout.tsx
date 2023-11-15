import React, { useRef } from 'react';
import styles from './SimpleLayout.module.scss';
import { BackToTop } from './footers/BackToTop';
import { CadDownloadStatusBalloon } from './footers/CadDownloadStatusBalloon';
import { SimpleFooter } from './footers/SimpleFooter';
import { SimpleHeader } from './headers/SimpleHeader';
import RootErrorBoundary from '@/components/pc/boundaries/RootErrorBoundary';
import { ErrorHandler } from '@/components/pc/error/ErrorHandler';
import { ContextProviders } from '@/components/pc/functional/ContextProviders';
import { Effective } from '@/components/pc/functional/Effective';
import { MessageModalController } from '@/components/pc/ui/modals/MessageModal';
import { ModalController } from '@/components/pc/ui/modals/Modal.hooks';

/**
 * Simple layout for PC
 */
export const SimpleLayout: React.FC = ({ children }) => {
	const rootRef = useRef<HTMLDivElement>(null);

	return (
		<RootErrorBoundary>
			<ContextProviders>
				<Effective />
				<div ref={rootRef} className={styles.layout}>
					<div className={styles.container}>
						<SimpleHeader />
						<div className={styles.childrenWrapper}>{children}</div>
						<SimpleFooter />
						<div className={styles.rightSideFloating}>
							<BackToTop layoutRootRef={rootRef} />
							<CadDownloadStatusBalloon />
						</div>
					</div>
				</div>
				<ErrorHandler />
				<ModalController />
				<MessageModalController />
			</ContextProviders>
		</RootErrorBoundary>
	);
};
SimpleLayout.displayName = 'SimpleLayout';

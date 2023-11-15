import dynamic from 'next/dynamic';
import React from 'react';
import styles from './Layout.module.scss';
import type { Props as HeaderProps } from './headers/Header';
import RootErrorBoundary from '@/components/mobile/boundaries/RootErrorBoundary';
import { ErrorHandler } from '@/components/mobile/error/ErrorHandler';
import { ContextProviders } from '@/components/mobile/functional/ContextProviders';
import { DummyHeader } from '@/components/mobile/layouts/headers/DummyHeader';
import { UniversalLoaderController } from '@/components/mobile/ui/loaders/UniversalLoader.context';
import { MessageModalController } from '@/components/mobile/ui/modals/MessageModal';
import { ModalController } from '@/components/mobile/ui/modals/Modal.hooks';
import type { Props as BottomNavProps } from '@/components/mobile/ui/navigations/BottomNav';
import { useBoolState } from '@/hooks/state/useBoolState';

/* eslint-disable @typescript-eslint/ban-types */
const Effective = dynamic<{}>(
	() =>
		import('@/components/mobile/functional/Effective').then(
			module => module.Effective
		),
	{ ssr: false }
);

const Header = dynamic<HeaderProps>(
	() => import('./headers/Header').then(module => module.Header),
	{ ssr: false, loading: () => <DummyHeader showsSearchBox={false} /> }
);

const BottomNav = dynamic<BottomNavProps>(
	() =>
		import('@/components/mobile/ui/navigations/BottomNav').then(
			module => module.BottomNav
		),
	{ ssr: false }
);

/**
 * Mobile Simple layout
 */
export const SimpleLayout: React.FC = ({ children }) => {
	const {
		bool: showsServiceMenu,
		setFalse: hideServiceMenu,
		toggle: toggleShowServiceMenu,
	} = useBoolState(false);

	return (
		<RootErrorBoundary>
			<ContextProviders>
				<Effective />
				<div className={styles.page}>
					<Header
						showsServiceMenu={showsServiceMenu}
						showsSearchBox={false}
						hideServiceMenu={hideServiceMenu}
						onToggleShowServiceMenu={toggleShowServiceMenu}
					/>
					<div className={styles.main}>{children}</div>
					<div className={styles.fixedBottom}>
						<BottomNav shouldHideUserPanel={showsServiceMenu} />
					</div>
				</div>
				<ErrorHandler />
				<ModalController />
				<MessageModalController />
				<UniversalLoaderController />
			</ContextProviders>
		</RootErrorBoundary>
	);
};
SimpleLayout.displayName = 'SimpleLayout';

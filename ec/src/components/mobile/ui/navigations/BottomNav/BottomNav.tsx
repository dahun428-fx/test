import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BottomNav.module.scss';
import { Drawer } from '@/components/mobile/ui/modals/Drawer';
import { UserPanel } from '@/components/mobile/ui/navigations/BottomNav/UserPanel';
import { useBoolState } from '@/hooks/state/useBoolState';
import { usePortal } from '@/hooks/ui/usePortal';
import { pagesPath } from '@/utils/$path';
import { url } from '@/utils/url';

type Props = {
	authenticated: boolean;
	cartCount: number | null;
	shouldHideUserPanel: boolean;
	showLoginModal: () => void;
	onClickCart: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
};

export const BottomNav: React.VFC<Props> = ({
	authenticated,
	cartCount,
	shouldHideUserPanel,
	showLoginModal,
	onClickCart,
}) => {
	const { pathname } = useRouter();
	const {
		bool: showsUserPanel,
		setFalse: hideUserPanel,
		toggle: toggleUserPanel,
	} = useBoolState(false);
	const [t] = useTranslation();
	const { Portal } = usePortal();

	useEffect(() => {
		Router.events.on('routeChangeStart', hideUserPanel);
		return () => {
			Router.events.off('routeChangeStart', hideUserPanel);
		};
	}, [hideUserPanel]);

	useEffect(() => {
		if (shouldHideUserPanel) {
			hideUserPanel();
		}
	}, [hideUserPanel, shouldHideUserPanel]);

	return (
		<nav>
			<ul className={styles.navs}>
				<li>
					<Link href={pagesPath.$url()}>
						<a
							data-active={!showsUserPanel && pathname === '/'}
							className={styles.home}
						>
							{t('mobile.ui.navigations.bottomNav.home')}
						</a>
					</Link>
				</li>
				<li>
					<Link href={pagesPath.vona2._categoryCode(['mech']).$url()}>
						<a
							data-active={
								!showsUserPanel && pathname === '/vona2/[...categoryCode]'
							}
							className={styles.category}
						>
							{t('mobile.ui.navigations.bottomNav.category')}
						</a>
					</Link>
				</li>
				<li className={styles.cartBox}>
					<a href={url.cart} className={styles.cart} onClick={onClickCart}>
						{t('mobile.ui.navigations.bottomNav.cart')}
						{authenticated && cartCount !== null && cartCount >= 1 && (
							<span className={styles.badge}>{cartCount}</span>
						)}
					</a>
				</li>
				{authenticated ? (
					<li>
						<span
							data-active={showsUserPanel}
							className={styles.myPage}
							onClick={toggleUserPanel}
						>
							{t('mobile.components.layouts.bottomNav.myPage')}
						</span>
						<Portal>
							<Drawer
								className={styles.userPanel}
								isOpen={showsUserPanel}
								top={50}
							>
								<UserPanel />
							</Drawer>
						</Portal>
					</li>
				) : (
					<li>
						<span className={styles.login} onClick={showLoginModal}>
							{t('mobile.components.layouts.bottomNav.login')}
						</span>
					</li>
				)}
			</ul>
		</nav>
	);
};
BottomNav.displayName = 'BottomNav';

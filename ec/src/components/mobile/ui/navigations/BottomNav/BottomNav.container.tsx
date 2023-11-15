import { useCallback } from 'react';
import { BottomNav as Presenter } from './BottomNav';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { useSelector } from '@/store/hooks';
import { selectAuthenticated } from '@/store/modules/auth';
import { selectCartCount } from '@/store/modules/cache';
import { url } from '@/utils/url';

export type Props = {
	shouldHideUserPanel: boolean;
};

export const BottomNav: React.VFC<Props> = ({ shouldHideUserPanel }) => {
	const authenticated = useSelector(selectAuthenticated);
	const showLoginModal = useLoginModal();
	const cartCount = useSelector(selectCartCount);

	const onClickCart = useCallback(
		async (e: React.MouseEvent<HTMLAnchorElement>) => {
			if (!authenticated) {
				e.preventDefault();
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}
			location.assign(url.cart);
		},
		[authenticated, showLoginModal]
	);

	return (
		<Presenter
			shouldHideUserPanel={shouldHideUserPanel}
			authenticated={authenticated}
			cartCount={cartCount}
			showLoginModal={showLoginModal}
			onClickCart={onClickCart}
		/>
	);
};
BottomNav.displayName = 'BottomNav';

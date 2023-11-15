import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { selectCartCount } from '@/store/modules/cache';

export const useAuth = () => {
	/** Authenticated */
	const authenticated = useSelector(selectAuthenticated);

	/** isPurchaseLinkUser */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);

	return { authenticated, isPurchaseLinkUser };
};

/**
 * cart count selector
 */
export const useCartCount = () => {
	return useSelector(selectCartCount);
};

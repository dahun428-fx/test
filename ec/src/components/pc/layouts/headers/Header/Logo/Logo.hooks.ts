import { useSelector } from '@/store/hooks';
import { selectIsPurchaseLinkUser } from '@/store/modules/auth';

export const useAuth = () => {
	/** isPurchaseLinkUser */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);

	return isPurchaseLinkUser;
};

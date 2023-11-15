import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';

/**
 * 認証状態を store からロードして返します
 */
export const useAuth = () => {
	/** ログイン済みか */
	const authenticated = useSelector(selectAuthenticated);

	/** EC会員か */
	const isEcUser = useSelector(selectIsEcUser);

	/** 購買連携ユーザか */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);

	return { authenticated, isEcUser, isPurchaseLinkUser };
};

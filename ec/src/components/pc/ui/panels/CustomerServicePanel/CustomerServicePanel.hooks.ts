import { useSelector } from '@/store/hooks';
import { selectIsEcUser, selectAuthenticated } from '@/store/modules/auth';

/**
 * 認証認可情報を store からロードして返します
 */
export const useAuth = () => {
	/** ログイン済みか */
	const authenticated = useSelector(selectAuthenticated);

	/** EC会員か */
	const isEcUser = useSelector(selectIsEcUser);

	return { authenticated, isEcUser };
};

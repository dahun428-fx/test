import { useSelector } from '@/store/hooks';
import { selectIsEcUser, selectUserPermissions } from '@/store/modules/auth';

/**
 * 認証認可情報を store からロードして返します
 */
export const useAuth = () => {
	/** 権限 */
	const permissions = useSelector(selectUserPermissions);
	/** EC会員か */
	const isEcUser = useSelector(selectIsEcUser);

	return { permissions, isEcUser };
};

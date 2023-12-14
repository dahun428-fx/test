import { useSelector } from '@/store/hooks';
import {
	selectIsEcUser,
	selectUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { selectOrderInfo } from '@/store/modules/pages/home';

/**
 * 認証認可情報を store からロードして返します
 */
export const useAuth = () => {
	/** 権限 */
	const permissions = useSelector(selectUserPermissions);
	/** EC会員か */
	const isEcUser = useSelector(selectIsEcUser);

	const selectedUserInfo = useSelector(selectUser);

	const selectedOrderInfo = useSelector(selectOrderInfo);

	return { permissions, isEcUser, selectedUserInfo, selectedOrderInfo };
};

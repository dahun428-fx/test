import { useSelector } from '@/store/hooks';
import {
	selectIsEcUser,
	selectIsHipus,
	selectIsNetRicoh,
	// selectUser,
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

	// const selectedUserInfo = useSelector(selectUser);

	const isHipus = useSelector(selectIsHipus);

	const isNetRicoh = useSelector(selectIsNetRicoh);

	const selectedOrderInfo = useSelector(selectOrderInfo);

	return {
		permissions,
		isEcUser,
		isHipus,
		isNetRicoh,
		// selectedUserInfo,
		selectedOrderInfo,
	};
};

import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';

export const useAuth = () => {
	/** Authenticated */
	const authenticated = useSelector(selectAuthenticated);

	/** Permissions */
	const permissions = useSelector(selectUserPermissions);

	/** Is EC User? */
	const isEcUser = useSelector(selectIsEcUser);

	return { authenticated, permissions, isEcUser };
};

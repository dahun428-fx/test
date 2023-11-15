import { useSelector } from '@/store/hooks';
import { selectIsEcUser, selectAuthenticated } from '@/store/modules/auth';
import { selectTopCategories } from '@/store/modules/cache';

export const useAuth = () => {
	/** Authenticated */
	const authenticated = useSelector(selectAuthenticated);

	/** EC user or not */
	const isECUser = useSelector(selectIsEcUser);

	return {
		authenticated,
		isECUser,
	};
};

export const useTopCategoryList = () => useSelector(selectTopCategories);

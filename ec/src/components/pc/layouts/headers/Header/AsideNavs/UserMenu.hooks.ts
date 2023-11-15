import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/store/hooks';
import {
	logout,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
	selectNotificationCount,
	selectUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { assertNotNull } from '@/utils/assertions';

/**
 * auth state
 */
export const useAuth = () => {
	const permissions = useSelector(selectUserPermissions);
	const user = useSelector(selectUser);
	const isEcUser = useSelector(selectIsEcUser);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	// Don't expect to be called anything other than authenticated.
	assertNotNull(user);
	return { user, permissions, isEcUser, isPurchaseLinkUser };
};

/**
 * logout operation
 */
export const useLogout = () => {
	const dispatch = useDispatch();
	return useCallback(() => logout(dispatch)(), [dispatch]);
};

/**
 * message count
 */
export const useMessageCount = () => {
	const messageCount = useSelector(selectNotificationCount);
	return messageCount;
};

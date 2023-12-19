import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/store/hooks';
import {
	logout,
	selectIsEcUser,
	selectIsNetRicoh,
	selectIsPurchaseLinkUser,
	selectNotificationCount,
	selectSettlementTypes,
	selectUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { selectOrderInfo } from '@/store/modules/pages/home';
import { assertNotNull } from '@/utils/assertions';
import { useOrderStatusPanel } from '../OrderStatus/OrderStatusPanel.hooks';
import { updateShowsStatusOperation } from '@/store/modules/common/orderStatusPanel';

/**
 * auth state
 */
export const useAuth = () => {
	const permissions = useSelector(selectUserPermissions);
	const user = useSelector(selectUser);
	const isEcUser = useSelector(selectIsEcUser);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const isNetRicoh = useSelector(selectIsNetRicoh);
	const selectedOrderInfo = useSelector(selectOrderInfo);
	const { isCashOnDeliveryUser, isCreditCardUser } = useSelector(
		selectSettlementTypes
	);
	// Don't expect to be called anything other than authenticated.
	assertNotNull(user);
	return {
		user,
		permissions,
		isEcUser,
		isNetRicoh,
		isPurchaseLinkUser,
		selectedOrderInfo,
		isCashOnDeliveryUser,
		isCreditCardUser,
	};
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

export const openOrderStatusPanel = () => {
	const { setShowsStatus } = useOrderStatusPanel();
	return setShowsStatus(true);
};

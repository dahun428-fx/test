import { useSelector } from '@/store/hooks';
import {
	selectIsPurchaseLinkUser,
	selectAuthenticated,
	selectNotificationCount,
	selectUnconfirmedMessageAndContactCount,
	selectUnconfirmedMessageCount,
} from '@/store/modules/auth';

export const useAuth = () => {
	/** Authenticated */
	const authenticated = useSelector(selectAuthenticated);

	/** Purchase Link User or not */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);

	/** Unconfirmed Notification Count */
	const notificationCount = useSelector(selectNotificationCount);

	/** Unconfirmed Message Count */
	const unconfirmedMessageCount = useSelector(selectUnconfirmedMessageCount);

	/** Unconfirmed Message and Contact Count */
	const unconfirmedMessageAndContactCount = useSelector(
		selectUnconfirmedMessageAndContactCount
	);

	return {
		authenticated,
		isPurchaseLinkUser,
		notificationCount,
		unconfirmedMessageCount,
		unconfirmedMessageAndContactCount,
	};
};

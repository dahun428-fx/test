import React from 'react';
import styles from './TopAside.module.scss';
import { UserPanel } from './UserPanel';
import { LoginForm } from '@/components/pc/pages/Home/LoginForm';
import { UserRegistrationPanel } from '@/components/pc/pages/Home/UserRegistrationPanel';
import { OrderPanel } from '@/components/pc/ui/panels/OrderPanel';
import { Flag } from '@/models/api/Flag';
import {
	CustomerType,
	GetUserInfoResponse,
} from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import type { UserPermissions } from '@/store/modules/auth';
import type { OrderInfo } from '@/store/modules/pages/home';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	authenticated: boolean;
	user: GetUserInfoResponse | null;
	permissions: UserPermissions;
	orderInfo: OrderInfo | null;

	className?: string;
};

export const TopAside: React.VFC<Props> = ({
	authenticated,
	user,
	permissions,
	orderInfo,
	className,
}) => {
	if (authenticated && orderInfo) {
		assertNotNull(user);
		const isEcUser = user.customerType === CustomerType.EC;
		const isPurchaseLinkUser = Flag.isTrue(user.purchaseLinkFlag);
		return (
			<div className={className}>
				<OrderPanel
					size="wide"
					{...permissions}
					isEcUser={isEcUser}
					isPurchaseLinkUser={isPurchaseLinkUser}
				/>
				<UserPanel
					isEcUser={isEcUser}
					isPurchaseLinkUser={isPurchaseLinkUser}
					{...permissions}
					{...orderInfo}
					{...user}
				/>
			</div>
		);
	}

	return (
		<div className={className}>
			<UserRegistrationPanel />
			<LoginForm className={styles.loginForm} />
		</div>
	);
};
TopAside.displayName = 'TopAside';

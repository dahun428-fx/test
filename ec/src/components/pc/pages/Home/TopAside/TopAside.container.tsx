import React from 'react';
import { TopAside as Presenter } from './TopAside';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { selectOrderInfo } from '@/store/modules/pages/home';

type Props = {
	className?: string;
};

export const TopAside: React.VFC<Props> = ({ className }) => {
	const authenticated = useSelector(selectAuthenticated);
	const user = useSelector(selectUser);
	const orderInfo = useSelector(selectOrderInfo);
	const permissions = useSelector(selectUserPermissions);

	return (
		<Presenter
			className={className}
			authenticated={authenticated}
			user={user}
			orderInfo={orderInfo}
			permissions={permissions}
		/>
	);
};
TopAside.displayName = 'TopAside';

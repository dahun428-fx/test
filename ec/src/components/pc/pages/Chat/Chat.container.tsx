import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chat as Presenter } from '@/components/shared/pages/Chat';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { useSelector } from '@/store/hooks';
import {
	refreshAuth,
	selectAuthIsReady,
	selectUser,
} from '@/store/modules/auth';

export const Chat: React.VFC = () => {
	const dispatch = useDispatch();
	const authIsReady = useSelector(selectAuthIsReady);
	const user = useSelector(selectUser);

	useOnMounted(() => {
		refreshAuth(dispatch)();
	});

	useEffect(() => {
		if (authIsReady) {
			ectLogger.visit();
			ga.settings.user(); // NOTE: 他のページでは Layout で行っています。
			ga.pageView.unclassified().then();
			aa.pageView.unclassified().then();
		}
	}, [authIsReady]);

	return <Presenter authIsReady={authIsReady} user={user} />;
};
Chat.displayName = 'Chat';

import React, { useEffect } from 'react';
import { Chat as Presenter } from '@/components/shared/pages/Chat';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { useSelector } from '@/store/hooks';
import { selectAuthIsReady, selectUser } from '@/store/modules/auth';
import legacyStyles from '@/styles/mobile/legacy/chat.module.scss';

/** Chat container */
export const Chat: React.VFC = () => {
	const user = useSelector(selectUser);
	const authIsReady = useSelector(selectAuthIsReady);

	useEffect(() => {
		if (authIsReady) {
			ectLogger.visit();
			ga.pageView.unclassified().then();
			aa.pageView.unclassified().then();
		}
	}, [authIsReady]);

	useEffect(() => {
		const bodyTag = document.querySelector('body');
		bodyTag?.classList.add(String(legacyStyles.chat));
		const chatTag = document.querySelector(
			'#chatplusview'
		) as HTMLDivElement | null;

		if (chatTag) {
			// NOTE: This logic for showing chat window again when back from other pages ( like: Top, Search Result, ... )
			// Currently, there is no other solution to reload Chat page when back from other page.
			// State before moving to other page will be shown.
			chatTag.style.display = 'block';
		}

		return () => {
			bodyTag?.classList.remove(String(legacyStyles.chat));
			const chatTag = document.querySelector(
				'#chatplusview'
			) as HTMLDivElement | null;

			if (chatTag) {
				// NOTE: This logic for hiding ChatPlus window when moving to other page on client side routing.
				// If removing script or chat tag, it will not able to show ChatPlus again when back from the other page.
				chatTag.style.display = 'none';
			}
		};
	}, []);

	return <Presenter authIsReady={authIsReady} user={user} />;
};

Chat.displayName = 'Chat';

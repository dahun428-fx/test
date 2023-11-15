import Router from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';
import { useSelector } from '@/store/hooks';
import { refreshAuth, selectUser } from '@/store/modules/auth';
import { loadTopCategories } from '@/store/modules/cache';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';
import { uuidv4 } from '@/utils/uuid';

/**
 * A component that describes common side effects
 * related to store modules.
 *
 * 画面全体で共通的な副作用を実装するコンポーネントです。
 * UIは特になく、主に store に関連する共通的な操作を記述する予定です。
 */
export const Effective: React.VFC = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	useOnMounted(() => {
		// for CRM contents or more
		if (!getCookie(Cookie.VONA_COMMON_LOG_KEY)) {
			setCookie(Cookie.VONA_COMMON_LOG_KEY, uuidv4());
		}

		if (!getCookie(Cookie.VONA_LOG_ID)) {
			setCookie(Cookie.VONA_LOG_ID, uuidv4().replace(/-/g, ''));
		}

		// Restore auth module state on mounted or reload.
		refreshAuth(dispatch)();
		// for MegaNav
		loadTopCategories(dispatch)();
	});

	useEffect(() => {
		const refresh = refreshAuth(dispatch);
		Router.events.on('routeChangeStart', refresh);
		return () => Router.events.off('routeChangeStart', refresh);
	}, [dispatch]);

	// When user info changes, re-set ga variables related user.
	useEffect(() => {
		if (user) {
			ga.settings.user();
		}
	}, [user]);

	return null;
};
Effective.displayName = 'Effective';

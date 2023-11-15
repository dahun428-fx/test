import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessageToast } from '@/components/pc/ui/toasts/MessageToast';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsPurchaseLinkUser,
	selectUnconfirmedMessageCount,
	selectUnconfirmedMessageAndContactCount,
} from '@/store/modules/auth';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';
import { url } from '@/utils/url';

/** cookie に保存される表示済みの値 */
const CONFIRMED = '1';

/** Delay to show message */
const DELAY_SHOW_TIME = 2000;

/**
 * A hook to show the toast for "new message arrived."
 * 「新着メッセージがあります」トーストを表示する hook
 */
export function useNewMessageArrivedToast() {
	const [t] = useTranslation();
	const { showMessageToast } = useMessageToast();
	const authenticated = useSelector(selectAuthenticated);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const unconfirmedMessageCount = useSelector(selectUnconfirmedMessageCount);
	const unconfirmedMessageAndContactCount = useSelector(
		selectUnconfirmedMessageAndContactCount
	);

	/**
	 * Show the toast for "new message arrived."
	 * 新着メッセージトーストを表示
	 */
	const showToastIfShould = useCallback(() => {
		if (
			authenticated &&
			!isPurchaseLinkUser &&
			((unconfirmedMessageCount && unconfirmedMessageCount > 0) ||
				(unconfirmedMessageAndContactCount &&
					unconfirmedMessageAndContactCount > 0)) &&
			getCookie(Cookie.VONAEC_UNCONFIRMED) !== CONFIRMED
		) {
			showMessageToast({
				message: t('components.ui.toasts.newMessageArrivedToast.message'),
				href: url.myPage.top,
				icon: 'mail',
				showMessageDelayTime: DELAY_SHOW_TIME,
			});

			// 1度表示したら、翌朝 8:00 まで表示しない
			setCookie(Cookie.VONAEC_UNCONFIRMED, CONFIRMED, {
				expires: dayjs().add(1, 'day').hour(8).startOf('hour').toDate(),
			});
		}
	}, [
		authenticated,
		isPurchaseLinkUser,
		unconfirmedMessageCount,
		unconfirmedMessageAndContactCount,
		showMessageToast,
		t,
	]);

	useEffect(() => {
		showToastIfShould();
		// 認証状態の変化のみを実行トリガーにしたいため以下の記載をしています。理解せずに真似しないでください。
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authenticated]);
}

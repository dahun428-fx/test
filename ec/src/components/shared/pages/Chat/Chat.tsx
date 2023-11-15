import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { getOneParams } from '@/utils/query';

type Props = {
	authIsReady: boolean;
	user: Readonly<GetUserInfoResponse> | null;
};

/** Chat Plus script URL */
export const scriptUrl = 'https://app.chatplus.jp/cp.js';

/** Chat Plus chat URL */
export const chatUrl = 'https://app.chatplus.jp';

export const Chat: React.VFC<Props> = ({ authIsReady, user }) => {
	const { t } = useTranslation();
	const [isReady, setIsReady] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (router.isReady && authIsReady) {
			const { site, referrer } = getOneParams(router.query, 'referrer', 'site');

			document.__cp_d = chatUrl;
			document.__cp_c = `${config.chatPlus.contractKey}_${site}`;
			document.__cp_p = {
				externalKey: user?.userCode ?? '',
				perhapsName: user ? `${user.userCode} ${user.userName}` : '',
				perhapsCompanyName: user
					? `${user.customerCode} ${user.customerName}`
					: '',
				referrer: String(referrer), // PHP版では存在しない場合「undefined」の文字列を送信
			};

			setIsReady(true);
		}
	}, [authIsReady, router.isReady, router.query, user]);

	return (
		<Head>
			<title>{t('shared.pages.chat.title')}</title>
			<meta name="description" content="" />
			<meta name="keywords" content="" />
			{isReady && <script src={scriptUrl} async />}
		</Head>
	);
};
Chat.displayName = 'Chat';

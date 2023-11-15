import React from 'react';
import { ChatPlus as Presenter } from './ChatPlus';
import { useSelector } from '@/store/hooks';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';

export const ChatPlus: React.VFC = () => {
	const authIsReady = useSelector(selectAuthIsReady);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);

	// 購買連携ユーザーの場合は表示しない
	if (!authIsReady || isPurchaseLinkUser) {
		return null;
	}

	return <Presenter />;
};
ChatPlus.displayName = 'ChatPlus';

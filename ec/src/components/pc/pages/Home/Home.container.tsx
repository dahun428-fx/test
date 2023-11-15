import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Home as Presenter } from './Home';
import { MiniBanners } from './Home.types';
import { MaintenanceMessage } from '@/models/api/cms/home/GetAttentionsResponse';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';
import { useSelector } from '@/store/hooks';
import { selectAuthenticated } from '@/store/modules/auth';
import { loadOnAuth } from '@/store/modules/pages/home';

export type Props = {
	bannerList: Banner[];
	maintenanceMessageList: MaintenanceMessage[];
	miniBanners: MiniBanners;
	newsArticleList: NewsArticle[];
	className?: string;
};

export const Home: React.VFC<Props> = props => {
	const dispatch = useDispatch();
	const authenticated = useSelector(selectAuthenticated);

	// 認証状態が切り替わりログイン済みになったらログイン済みの状態で取得すべきデータを fetch
	// (ログアウト時は extraReducer によってクリアされるので考慮不要)
	useEffect(() => {
		if (authenticated) {
			loadOnAuth(dispatch)();
		}
	}, [authenticated, dispatch]);

	return <Presenter {...props} />;
};
Home.displayName = 'Home';

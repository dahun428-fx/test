import React from 'react';
import { News as Presenter } from './News';
import { NewsArticle } from '@/models/api/cms/home/GetNewsArticleResponse';
import { useSelector } from '@/store/hooks';
import { selectIsPurchaseLinkUser } from '@/store/modules/auth';

type Props = {
	newsArticleList: NewsArticle[];
};

export const News: React.VFC<Props> = ({ newsArticleList }) => {
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	if (isPurchaseLinkUser) {
		return null;
	}
	return <Presenter newsArticleList={newsArticleList} />;
};
News.displayName = 'News';

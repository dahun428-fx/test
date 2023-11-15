import { ApiResponse } from '@/models/api/ApiResponse';
import { Flag } from '@/models/api/Flag';

/**
 * ニュース文章取得レスポンス
 */
export interface GetNewsArticleResponse extends ApiResponse {
	/** ニュース文章リスト */
	newsArticleList: NewsArticle[];
}

export interface NewsArticle {
	/** ポスト日付き */
	postedDate: string;
	/** ニュースタイトル */
	title: string;
	/** ニュースリンク */
	url: string;
	/** 別タブで開くか */
	targetBlankFlag: Flag;
}

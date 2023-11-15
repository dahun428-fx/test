import { cmsApi } from '@/api/clients';
import { GetNewsArticleResponse } from '@/models/api/cms/home/GetNewsArticleResponse';

/**
 * ニュースエリアに表示する文章情報を取得する
 */
export async function getNewsArticle(): Promise<GetNewsArticleResponse> {
	return cmsApi.get('/news/topics/top_news.html');
}

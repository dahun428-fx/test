import { cmsApi } from '@/api/clients';
import { GetTopBannerResponse } from '@/models/api/cms/home/GetTopBannerResponse';

/**
 * トップバナーに掲載する情報を取得する
 */
export async function getTopBanner(): Promise<GetTopBannerResponse> {
	return cmsApi.get('/news/banner2/top_banner.html');
}

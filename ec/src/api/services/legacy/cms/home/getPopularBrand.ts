import { cmsApi } from '@/api/clients';
import { GetPopularBrandResponse } from '@/models/api/cms/home/GetPopularBrandResponse';

/**
 * 人気ブランドに関する情報を取得する
 */
export async function getPopularBrand(): Promise<GetPopularBrandResponse> {
	return cmsApi.get('/operation/top/include/popular_brand.json');
}

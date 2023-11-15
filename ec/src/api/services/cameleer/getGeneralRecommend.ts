import { cameleerApi } from '@/api/clients/cameleerApi';
import { config } from '@/config';
import { GetGeneralRecommendRequest } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendRequest';
import {
	GeneralRecommendAPIResponse,
	GetGeneralRecommendResponse,
} from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

export type GetGeneralRecommendParam = {
	/* 当該レコメンドエリアのレコメンドキー
	 * 検索結果
	 *  - 検索結果の商品を見た人は、こんな商品も見ています: rid3
	 * カテゴリTOP
	 *  - 最近見た商品からのおすすめ商品c10-0001
	 * カテゴリ(スペック検索なし)
	 *  - 最近見た○○の商品からのおすすめ: c22
	 *  - ミスミでまとめて効率化: c12
	 * カテゴリ(スペック検索あり)
	 *  - 最近見た○○の商品からのおすすめ: c22
	 *  - こちらにお探しの商品はございませんか: c13
	 * 商品詳細
	 *  - よく一緒に購入される商品: c24-allusers
	 */
	recommendCd: 'rid3' | 'c10-0001' | 'c12' | 'c22' | 'c13' | 'c24-allusers';
	seriesCodeOrItemCd: string;
};

/**
 * Get General Recommend.
 * @param {GetGeneralRecommendParam} param
 */
export async function getGeneralRecommend({
	recommendCd,
	seriesCodeOrItemCd,
}: GetGeneralRecommendParam): Promise<GetGeneralRecommendResponse | null> {
	const response = await cameleerApi.get<
		GetGeneralRecommendRequest,
		GeneralRecommendAPIResponse
	>('/cameleer/REST/GeneralRecommend', {
		subsidiary: config.subsidiaryCode,
		key: `${recommendCd},${seriesCodeOrItemCd},,`,
	});

	response.contents.map((item, index) => {
		// logging用にpositionを付与(1スタート)
		item.position = index + 1;
		/* logging用。ログは初回表示時の1回のみでよいので、送信完了後にtrue化してフラグ判定に使う */
		item.initialized = false;
	});

	return response.contents;
}

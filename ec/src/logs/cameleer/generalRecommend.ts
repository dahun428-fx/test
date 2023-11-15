import { cameleerApi } from '@/api/clients';
import { GetGeneralRecommendParam } from '@/api/services/cameleer/getGeneralRecommend';
import { config } from '@/config';
import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';
import { store } from '@/store';
import { selectUserCode } from '@/store/modules/auth';
import { assertNotEmpty } from '@/utils/assertions';
import { Cookie, getCookie } from '@/utils/cookie';

export type GeneralRecommendLogParams = {
	/* レコメンド対象がシリーズの場合はシリーズコード、カテゴリの場合はカテゴリコード */
	seriesCodeOrItemCd: string;
	/* 対象のレコメンドキー */
	recommendCd: GetGeneralRecommendParam['recommendCd'];
	/* どのページに埋め込まれたかを判別するもの */
	dispPage:
		| 'alluser_detail'
		| `ctg${number}`
		| 'ctop'
		| 'detail'
		| 'searchResult';
	/* 表示するアイテムが何番目など */
	position: number;
};

/**
 * 共通レコメンドリクエストのパラメータを生成する
 * @param params
 */
const generateCommonRequestParams = (params: GeneralRecommendLogParams) => {
	const { seriesCodeOrItemCd, recommendCd, dispPage, position } = params;
	const userCode = selectUserCode(store.getState());
	const cookieId = getCookie(Cookie.VONA_COMMON_LOG_KEY);
	assertNotEmpty(cookieId);

	return {
		subsidiary: config.subsidiaryCode,
		x: cookieId,
		x2: seriesCodeOrItemCd,
		x3: userCode,
		recommendCd,
		dispPage: dispPage,
		position,
	};
};

/**
 * impression log API
 * 表示された(カルーセル次ページ以降を含む)レコメンドアイテム全量を対象として、
 * 各レコメンドアイテムの情報をそれぞれImpression Logとして出力する
 * @param params
 */
const impressionLog = async (
	params: GeneralRecommendLogParams
): Promise<null> => {
	return cameleerApi
		.get<CameleerApiRequest, never>(
			'/cameleer/ImpressionTracker',
			generateCommonRequestParams(params)
		)
		.catch(() => null);
};

/**
 * click log API
 * クリックされたタイミングで該当レコメンドアイテムの情報をClickTracker Logとして出力する
 * @param params
 */
const clickLog = async (params: GeneralRecommendLogParams): Promise<null> => {
	return cameleerApi
		.get<CameleerApiRequest, never>(
			'/cameleer/ClickTracker',
			generateCommonRequestParams(params)
		)
		.catch(() => null);
};

export const generalRecommendLogger = {
	impressionLog,
	clickLog,
} as const;

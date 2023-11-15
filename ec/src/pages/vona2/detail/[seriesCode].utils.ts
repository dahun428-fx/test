import { parse } from 'cookie';
import { ParsedUrlQuery } from 'querystring';
import { config } from '@/config';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { CadType } from '@/models/api/constants/CadType';
import { ErrorCode } from '@/models/api/constants/ErrorCode';
import { assertNotNull } from '@/utils/assertions';
import { Cookie } from '@/utils/cookie';
import { parseSpecValue } from '@/utils/domain/spec';
import { getOneParams } from '@/utils/query';

/** Get params from query */
export function getParams(query: ParsedUrlQuery) {
	const params = getOneParams(
		query,
		'seriesCode',
		'Template',
		'HissuCode',
		'ProductCode',
		'Page',
		'CategorySpec',
		'CAD',
		'HyjnNoki',
		'Tab'
	);
	assertNotNull(params.seriesCode);

	return {
		seriesCode: params.seriesCode,
		partNumber: params.HissuCode ?? params.ProductCode,
		template: params.Template,
		page: params.Page ? parseInt(params.Page) : undefined,
		cadType:
			params.CAD === '10'
				? CadType['2D']
				: params.CAD === '01'
				? CadType['3D']
				: undefined,
		categorySpec: parseSpecValue(params.CategorySpec),
		daysToShip: params.HyjnNoki ? parseInt(params.HyjnNoki) : undefined,
		tab: params.Tab,
	};
}

/**
 * リダイレクト先のシリーズコードを取得します
 * @param apiError
 */
export function getRedirectTo(apiError: MsmApiError) {
	if (apiError.response == null) {
		return false;
	}
	const params = apiError.errorParams(ErrorCode.MOVED_PERMANENTLY);

	if (params == null || params.length === 0) {
		return false;
	}
	return typeof params[0] === 'string' && params[0];
}

/**
 * 以下の優先順位で pageSize を決定します
 * 1. cookie に保存されているユーザーの最後に選択した pageSize
 * 2. Tab=codeList(クローラー向け) の場合、選択肢のうち最大の件数(config)
 * 3. 1, 2 にも当てはまらないデフォルトの pageSize(config)
 *
 * @param cookie
 * @param tab
 */
export function getPageSize(
	cookie: string | undefined,
	tab: string | undefined
) {
	const defaultPageSize = config.pagination.detail.size;
	const pageSizeList = config.pagination.detail.sizeList;

	// ユーザーが最後に選択したページサイズ
	const personalPageSize = Number(
		(cookie ? parse(cookie) : {})[Cookie.VONA_ITEM_DETAIL_PER_PAGE.name]
	);

	if (
		!Number.isNaN(personalPageSize) &&
		personalPageSize !== 0 &&
		pageSizeList.includes(personalPageSize)
	) {
		return personalPageSize;
	}

	return tab === 'codeList'
		? // 型番リストタブが指定されている場合は、最大サイズ
		  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		  pageSizeList[pageSizeList.length - 1]!
		: defaultPageSize;
}

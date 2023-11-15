import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';

const SERIES_HISTORY_SIZE = 12;
const CATEGORY_HISTORY_SIZE = 8;

/**
 * Append to viewed series histories on viewed series.
 * Also append category of series to viewed category histories.
 *
 * @param series
 */
export function viewSeries(
	series: Pick<Series, 'seriesCode' | 'categoryCode' | 'categoryList'>
) {
	const { seriesCode, categoryCode, categoryList } = series;
	try {
		// update cookie value of "seriesviewhist"
		window.Cameleer?.toastSeries(series.seriesCode);
	} catch {
		// noop
	}

	appendHistory(Cookie.RECENTLY_VIEWED_SERIES, seriesCode, SERIES_HISTORY_SIZE);

	if (categoryCode && categoryList.length) {
		const parentCategoryCodeList = categoryList.map(
			category => category.categoryCode
		);
		viewCategory({ categoryCode, parentCategoryCodeList });
	}
}

/**
 * Append view category histories on viewed category.
 * @param category
 */
export function viewCategory(
	category: Pick<Category, 'categoryCode' | 'parentCategoryCodeList'>
) {
	const { categoryCode, parentCategoryCodeList } = category;
	const categoryCodeList = [...parentCategoryCodeList, categoryCode];

	// adopt third level category in categoryviewhist
	const thirdCategory = categoryCodeList[2];

	if (thirdCategory) {
		try {
			window.Cameleer?.toastCategory(thirdCategory);
		} catch {
			// noop
		}
	}

	appendHistory(
		Cookie.RECENTLY_VIEWED_CATEGORY,
		categoryCode,
		CATEGORY_HISTORY_SIZE
	);
}

function appendHistory(cookie: Cookie, value: string, maxLength: number) {
	const cookieValue = getCookie(cookie);

	if (cookieValue) {
		// exclude same value as new history from histories
		const histories = cookieValue.split(',').filter(item => item !== value);
		setCookie(cookie, [value, ...histories].slice(0, maxLength).join(','));
	} else {
		setCookie(cookie, value);
	}
}

import { TFunction } from 'i18next';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { Category as SeriesCategory } from '@/models/api/msm/ect/series/SearchSeriesResponse';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TabType } from '@/models/api/msm/ect/series/shared';
import { SearchTypeResponse } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { Cookie, getCookie } from '@/utils/cookie';

type SeriesNameParams = {
	seriesName: string;
	minPiecesPerPackage?: number;
	maxPiecesPerPackage?: number;
};

/**
 * Get series name with package quantity.
 */
export function getSeriesNameDisp(params: SeriesNameParams, t: TFunction) {
	const packDisp = getPiecePerPackageDisp(params, t);
	if (!packDisp) {
		return params.seriesName;
	}
	return `${params.seriesName} (${packDisp})`;
}

/**
 * Get piece per package disp.
 */
export function getPiecePerPackageDisp(
	{
		minPiecesPerPackage = 1,
		maxPiecesPerPackage = minPiecesPerPackage,
	}: SeriesNameParams,
	t: TFunction
) {
	if (maxPiecesPerPackage <= 1) {
		return null;
	}

	if (minPiecesPerPackage === maxPiecesPerPackage) {
		return t('utils.domain.series.piecePerPackage', {
			piecePerPackage: minPiecesPerPackage,
		});
	}
	return t('utils.domain.series.piecePerPackageWithRange', {
		min: minPiecesPerPackage,
		max: maxPiecesPerPackage,
	});
}

/** Get series count */
export function getSeriesCount(
	categoryCode: string,
	seriesCategory: SeriesCategory[] | undefined
): number | undefined {
	return seriesCategory?.find(item => item.categoryCode === categoryCode)
		?.seriesCount;
}

export function getEleWysiwygHtml(series: Series) {
	if (Array.of<string>(TabType.ELE_A, TabType.ELE_B).includes(series.tabType)) {
		return series.productDescriptionHtml;
	}
}

const DEFAULT_PAGE_SIZE = 30;

/** Get the current page size. */
export function getPageSize() {
	const pageSize = Number(getCookie(Cookie.VONA_ITEM_RESULT_PER_PAGE));
	if (!Number.isNaN(pageSize)) {
		return pageSize;
	}
	return DEFAULT_PAGE_SIZE;
}

/** Classify type response to normal, unlisted, discontinued list. */
export function classifySeriesList(typeResponse: SearchTypeResponse) {
	const normalList = [];
	const unlistedList = [];
	const discontinuedList = [];

	for (const series of typeResponse.seriesList) {
		switch (series.seriesStatus) {
			case SeriesStatus.NORMAL:
				normalList.push(series);
				break;
			case SeriesStatus.UNLISTED:
				unlistedList.push(series);
				break;
			case SeriesStatus.DISCONTINUED:
				discontinuedList.push(series);
				break;
		}
	}

	return { normalList, discontinuedList, unlistedList };
}

export function getTemplateType(
	templateType: TemplateType,
	template: string | undefined
): TemplateType {
	if (template) {
		switch (template) {
			case 'default':
				return TemplateType.COMPLEX;
			case 'simple':
				return TemplateType.SIMPLE;
			case 'patternh':
				return TemplateType.PATTERN_H;
			case 'wysiwyg':
				return TemplateType.WYSIWYG;
			// NOTE: 誤った template の場合は、シリーズに設定されている templateType を採用する
		}
	}
	return templateType;
}

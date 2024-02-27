import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TFunction, TFunctionResult } from 'i18next';
import { removeTags } from '../string';
import { Category as SeriesCategory } from '@/models/api/msm/ect/category/SearchCategoryResponse';

const Category = {
	/** mech (top category code)  */
	MECH: 'mech',
	/** mech_screw (top category code)  */
	MECH_SCREW: 'mech_screw',
	/** mech_material (top category code) */
	MECH_MATERIAL: 'mech_material',
	/** fs_logistics (top category code) */
	FS_LOGISTICS: 'fs_logistics',
	/** fs_health (top category code) */
	FS_HEALTH: 'fs_health',
	/** fs_lab (top category code) */
	FS_LAB: 'fs_lab',
	/** fs_machining (top category code) */
	FS_MACHINING: 'fs_machining',
	/**  fs_processing (top category code) */
	FS_PROCESSING: 'fs_processing',
	/**  press (top category code) */
	PRESS: 'press',
	/**  mold (top category code) */
	MOLD: 'mold',
	/**  injection (top category code) */
	INJECTION: 'injection',
	/**  el_wire (top category code)  */
	EL_WIRE: 'el_wire',
	/**   el_control (top category code) */
	EL_CONTROL: 'el_control',
} as const;
type Category = typeof Category[keyof typeof Category];

const TopCategoryGroup = {
	/** Pattern that top category code is mech/mech_screw/mech_material */
	GROUP_01: '1',
	/** Pattern that top category code is fs_logistics/fs_health/fs_lab */
	GROUP_02: '2',
	/** Pattern that top category code is fs_machining/fs_processing */
	GROUP_03: '3',
	/** Pattern that top category code is press/mold/injection */
	GROUP_04: '4',
	/** Pattern that top category code is  el_wire/el_control */
	GROUP_05: '5',
} as const;
type TopCategoryGroup = typeof TopCategoryGroup[keyof typeof TopCategoryGroup];

export function getDepartmentKeywordsFix(t: TFunction) {
	return t('utils.domain.desciption.fix');
}
export function getDepartmentKeywords(departmentCode: string, t: TFunction) {
	const departments: Record<string, TFunctionResult> = {
		mech: t('utils.domain.departmentCode.mech'),
		mech_screw: t('utils.domain.departmentCode.mech_screw'),
		mech_material: t('utils.domain.departmentCode.mech_material'),
		el_wire: t('utils.domain.departmentCode.el_wire'),
		el_control: t('utils.domain.departmentCode.el_control'),
		fs_machining: t('utils.domain.departmentCode.fs_machining'),
		fs_processing: t('utils.domain.departmentCode.fs_processing'),
		fs_logistics: t('utils.domain.departmentCode.fs_logistics'),
		fs_health: t('utils.domain.departmentCode.fs_health'),
		fs_lab: t('utils.domain.departmentCode.fs_lab'),
		press: t('utils.domain.departmentCode.press'),
		mold: t('utils.domain.departmentCode.mold'),
		injection: t('utils.domain.departmentCode.injection'),
	};
	return (departments[departmentCode] as string) ?? '';
}

export function verifyTopCategoryGroup(
	topCategoryCode: string | undefined,
	topCategoryGroup: string
) {
	let group = '';
	const {
		MECH,
		MECH_SCREW,
		MECH_MATERIAL,
		FS_LOGISTICS,
		FS_HEALTH,
		FS_LAB,
		FS_MACHINING,
		FS_PROCESSING,
		PRESS,
		MOLD,
		INJECTION,
		EL_WIRE,
		EL_CONTROL,
	} = Category;

	const { GROUP_01, GROUP_02, GROUP_03, GROUP_04, GROUP_05 } = TopCategoryGroup;

	switch (topCategoryCode) {
		case MECH:
		case MECH_SCREW:
		case MECH_MATERIAL:
			group = GROUP_01;
			break;
		case FS_LOGISTICS:
		case FS_HEALTH:
		case FS_LAB:
			group = GROUP_02;
			break;
		case FS_MACHINING:
		case FS_PROCESSING:
			group = GROUP_03;
			break;
		case PRESS:
		case MOLD:
		case INJECTION:
			group = GROUP_04;
			break;
		case EL_WIRE:
		case EL_CONTROL:
			group = GROUP_05;
			break;
	}
	return group === topCategoryGroup;
}

export function getDescriptionMessage(
	messages: string[],
	topCategoryCode?: string
) {
	const groupIndex = messages.findIndex((message, index) =>
		verifyTopCategoryGroup(topCategoryCode, `${index + 1}`)
	);
	return messages[groupIndex] ?? '';
}

export const seriesDescContent = (
	series: Series,
	specifiedPartNumber?: string
) => {
	let resultText = '';
	if (specifiedPartNumber) {
		resultText = `${series.brandName}의 ${series.seriesName} (${specifiedPartNumber}) 입니다.`;
	} else {
		resultText = `${series.brandName}의 ${series.seriesName} 입니다.`;
	}

	const catchCopy = series.catchCopy;
	if (catchCopy) {
		const stripContent = removeTags(catchCopy);
		resultText = `${resultText} ${stripContent}`;
	}
	const withoutSpaceLength = resultText.replaceAll(' ', '').length;
	const limit = 100;

	if (withoutSpaceLength >= limit) {
		let strTotalCount = 0;
		let blankCount = 0;
		let len = resultText.length;
		let index = 0;

		while (index < len) {
			if (strTotalCount >= limit) {
				break;
			}
			let str = resultText.substring(index, index + 1);
			if (str.match(/\s+/)) {
				blankCount++;
			} else {
				strTotalCount++;
			}
			index++;
		}
		let lastIndex = strTotalCount + blankCount;
		resultText = `${resultText.substring(0, lastIndex)}...`;
	}

	return resultText;
};

export const seriesKeywordsContent = (series: Series, t: TFunction) => {
	if (!series) {
		return '';
	}

	const { seriesName, brandName, departmentCode } = series;

	const categoryNameList = seoKeywordsCategory(series);

	const seoKeywords = getDepartmentKeywords(departmentCode, t);
	const suffix = '한국미스미, 미스미, MISUMI';
	const resultText = `${seriesName}, ${brandName}, ${categoryNameList}, ${seoKeywords}, ${suffix}`;

	const set = new Set<string>();
	resultText.split(',').forEach(item => {
		item = item.trim();
		set.add(item);
	});
	return Array.from(set).join(', ');
};

const seoKeywordsCategory = (series: Series) => {
	const { categoryName, categoryCode } = series;
	const categoryList: Pick<SeriesCategory, 'categoryCode' | 'categoryName'>[] =
		[...series.categoryList];

	if (categoryCode && categoryName) {
		categoryList.push({
			categoryCode,
			categoryName,
		});
	}
	return categoryList
		.map(category => category.categoryName)
		.reverse()
		.join(',');
};

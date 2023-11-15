import type { TFunction, TFunctionResult } from 'i18next';
import type { ParsedUrlQuery } from 'querystring';
import type { Breadcrumb } from '@/components/pc/ui/links/Breadcrumbs';
import { ApplicationError } from '@/errors/ApplicationError';
import { Flag } from '@/models/api/Flag';
import { CadType, CadTypeParam } from '@/models/api/constants/CadType';
import type { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import type {
	SeriesSpec,
	SpecValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse';
import type { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { pagesPath } from '@/utils/$path';
import { first } from '@/utils/collection';
import { parseSpecValue } from '@/utils/domain/spec';
import { getOneParams } from '@/utils/query';
import { url, getUrlPath } from '@/utils/url';

export type CategorySpec = {
	spec: SeriesSpec;
	specValue: SpecValue;
};

/** Get category list from category root */
export function getCategoryListFromRoot(
	rootCategory: Category,
	categoryCode: string
): Category[] {
	let stack: Category[] = [];
	stack.push(rootCategory);

	if (rootCategory.categoryCode === categoryCode) {
		return stack;
	}

	if (rootCategory.childCategoryList.length) {
		for (const category of rootCategory.childCategoryList) {
			const found = getCategoryListFromRoot(category, categoryCode);
			if (found.length) {
				stack = stack.concat(getCategoryListFromRoot(category, categoryCode));
				return stack;
			}
		}
	}

	stack.pop();
	return stack;
}

/** Get category spec from query */
export const getCategorySpecFromQuery = (
	categorySpecQuery: string,
	seriesResponse: SearchSeriesResponse$search
): CategorySpec | null => {
	const [specCode, specValue] = categorySpecQuery.split('::');
	if (!specCode || !specValue) {
		return null;
	}

	const spec = seriesResponse.seriesSpecList.find(
		spec => spec.specCode === specCode
	);
	if (!spec) {
		return null;
	}

	const value = spec.specValueList.find(value => value.specValue === specValue);
	if (!value) {
		return null;
	}

	return { spec, specValue: value };
};

/** Format category spec */
export const formatCategorySpec = (
	categorySpec: CategorySpec | null
): string => {
	if (!categorySpec) {
		return '';
	}

	return `${categorySpec.spec.specName}: ${categorySpec.specValue.specValueDisp}`;
};

export function getBreadcrumbList(payload: {
	categoryList: Category[];
	currentCategory?: Category;
	page: number;
	categorySpec?: CategorySpec | null;
	t: TFunction;
}): Breadcrumb[] {
	const { categoryList, currentCategory, page, categorySpec, t } = payload;

	if (!currentCategory) {
		return [];
	}

	const categroyCodeList = categoryList.map(category => category.categoryCode);

	return [
		...(categoryList.length > 0
			? categoryList.map((category, index) => ({
					text: category.categoryName,
					href: pagesPath.vona2
						._categoryCode(categroyCodeList.slice(0, index + 1))
						.$url(),
			  }))
			: []),
		...(Flag.isTrue(currentCategory.specSearchFlag)
			? getBreadcrumbListWithSpecSearchForCategory({
					categoryList,
					currentCategory,
					page,
					categorySpec,
					t,
			  })
			: [
					{
						text: currentCategory.categoryName,
					},
			  ]),
	];
}

export function getBreadcrumbListWithSpecSearchForCategory(payload: {
	categoryList: Category[];
	currentCategory?: Category;
	page: number;
	categorySpec?: CategorySpec | null;
	t: TFunction;
}): Breadcrumb[] {
	const { categoryList, currentCategory, page, categorySpec, t } = payload;
	const breadcrumbs: Breadcrumb[] = [];

	if (!currentCategory) {
		return [];
	}

	if (categorySpec || page > 1) {
		// Current category
		breadcrumbs.push({
			text: currentCategory.categoryName,
			href: url.category(
				...categoryList.map(({ categoryCode }) => categoryCode),
				currentCategory.categoryCode
			)(),
		});

		if (categorySpec && page > 1) {
			// Category spec
			breadcrumbs.push({
				text: `${categorySpec.spec.specName}:${categorySpec.specValue.specValueDisp}`,
				href: url
					.category(
						...categoryList.map(({ categoryCode }) => categoryCode),
						currentCategory.categoryCode
					)
					.fromSpecSearch({
						CategorySpec: `${categorySpec.spec.specCode}::${categorySpec.specValue.specValue}`,
					}),
			});

			// Page
			breadcrumbs.push({
				text: t('utils.domain.category.titlePage', {
					page,
				}),
			});
		} else if (categorySpec) {
			// Category spec
			breadcrumbs.push({
				text: `${categorySpec.spec.specName}:${categorySpec.specValue.specValueDisp}`,
			});
		} else if (page > 1) {
			// Page
			breadcrumbs.push({
				text: t('utils.domain.category.titlePage', {
					page,
				}),
			});
		}
	} else {
		breadcrumbs.push({
			text: currentCategory.categoryName,
		});
	}

	return breadcrumbs;
}

export function getCategoryCodeForViewHistoryCookie(
	parentCategoryCodeList: string[],
	categoryCode: string
) {
	const categoryCodeLevel2 = parentCategoryCodeList[1];
	let categoryCodeLevel3 = parentCategoryCodeList[2];

	if (!!categoryCodeLevel2 && !categoryCodeLevel3) {
		categoryCodeLevel3 = categoryCode;
	}

	if (!categoryCodeLevel2 && !categoryCodeLevel3) {
		categoryCodeLevel3 = '';
	}

	return categoryCodeLevel3;
}

/** Convert cad type to query parameter */
export function convertCadTypeToQueryParameter(cadType?: string) {
	if (!cadType) {
		return undefined;
	}

	return {
		[CadType['2D']]: CadTypeParam['2D'],
		[CadType['3D']]: CadTypeParam['3D'],
		[CadType['2D_3D']]: CadTypeParam['2D_3D'],
	}[cadType];
}

/** Convert cad type to for api request */
export function convertCadTypeApiRequest(cadType?: string) {
	if (!cadType) {
		return undefined;
	}

	return {
		[CadTypeParam['2D']]: CadType['2D'],
		[CadTypeParam['3D']]: CadType['3D'],
		[CadTypeParam['2D_3D']]: CadType['2D_3D'],
	}[cadType];
}

const appendBrandCode = (brandCodeList = '', addedBrandCode: string) => {
	const brandCodes = brandCodeList.split(',');
	if (!brandCodes.includes(addedBrandCode)) {
		brandCodes.push(addedBrandCode);
	}
	return brandCodes.join(',');
};

/** Get category params */
export function getCategoryParams(query: ParsedUrlQuery) {
	const params = getOneParams(
		query,
		'Page',
		'CategorySpec',
		'Brand',
		'CAD',
		'HyjnNoki',
		'c_value'
	);

	const cValueParam = params.c_value;
	const isCValueParamValid = !!cValueParam && Flag.isFlag(cValueParam);

	if (
		'c_value' in query &&
		(cValueParam === undefined || !Flag.isFlag(cValueParam))
	) {
		throw new ApplicationError('Invalid c_value');
	}

	return {
		page: params.Page ? parseInt(params.Page) : 1,
		// NOTE: if url contains c_value query param, MSM1 and c_value checkboxes should be checked on page load
		brandCode:
			isCValueParamValid && Flag.isTrue(cValueParam)
				? appendBrandCode(params.Brand, 'MSM1')
				: params.Brand,
		cadType: convertCadTypeApiRequest(params.CAD),
		daysToShip: params.HyjnNoki ? parseInt(params.HyjnNoki) : undefined,
		categorySpec: params.CategorySpec,
		cValueFlag: isCValueParamValid ? cValueParam : undefined,
	};
}

export function departmentKeywords(departmentCode: string, t: TFunction) {
	const departments: Record<string, TFunctionResult> = {
		mech: t('utils.domain.departmentCode.mech'),
		el: t('utils.domain.departmentCode.el'),
		fs: t('utils.domain.departmentCode.fs'),
		mold: t('utils.domain.departmentCode.mold'),
		press: t('utils.domain.departmentCode.press'),
	};

	return departments[departmentCode] ?? '';
}

/** Get spec params */
export function getSpecFromQuery(
	seriesResponse?: SearchSeriesResponse$search,
	CategorySpec?: string
) {
	const parsedCategorySpecQuery = parseSpecValue(CategorySpec);

	if (
		!seriesResponse ||
		!parsedCategorySpecQuery ||
		Object.keys(parsedCategorySpecQuery).length !== 1
	) {
		return null;
	}

	const specValues = first(Object.values(parsedCategorySpecQuery));
	const specCode = first(Object.keys(parsedCategorySpecQuery));

	if (!specValues || typeof specValues === 'string') {
		return null;
	}

	if (specValues.length !== 1) {
		return null;
	}

	const seriesSpec = seriesResponse.seriesSpecList.find(
		value => value.specCode === specCode
	);

	if (!seriesSpec) {
		return null;
	}
	const firstSpecValue = first(specValues);

	const specValue = seriesSpec.specValueList.find(
		item => item.specValue === firstSpecValue
	);

	if (!specValue) {
		return null;
	}

	return { seriesSpec, specValue };
}

/** Filter spec params */
export function filterSpecFromQuery(
	seriesResponse?: SearchSeriesResponse$search,
	CategorySpec?: string
) {
	const parsedCategorySpecQuery = parseSpecValue(CategorySpec);

	if (!seriesResponse || !parsedCategorySpecQuery) {
		return null;
	}

	const currentSpec: Record<string, Set<string>> = {};

	for (const specCode in parsedCategorySpecQuery) {
		const seriesSpec = seriesResponse.seriesSpecList.find(
			seriesSpec => seriesSpec.specCode === specCode
		);

		if (seriesSpec) {
			currentSpec[specCode] = new Set();
		}

		const parsedSpecValues = parsedCategorySpecQuery[specCode];

		if (seriesSpec && parsedSpecValues && Array.isArray(parsedSpecValues)) {
			parsedSpecValues.forEach(parsedSpecValue => {
				const hasSpec = seriesSpec.specValueList.some(
					seriesSpecValue => seriesSpecValue.specValue === parsedSpecValue
				);

				if (hasSpec) {
					currentSpec[specCode]?.add(parsedSpecValue);
				}
			});
		}
	}

	const result: Record<string, string[]> = {};

	// Convert Set object to array
	for (const specCode in currentSpec) {
		const specValues = currentSpec[specCode];

		if (specValues) {
			result[specCode] = Array.from(specValues);
		}
	}

	return result;
}

/** To string spec code and spec values */
export function stringifySpecValues(spec: Record<string, string[]>) {
	const result: string[] = [];

	for (const [key, value] of Object.entries(spec)) {
		result.push(`${key}::${value.join(',')}`);
	}

	return result.join('\t');
}

/**
 * Get category page url
 * - dragon 実装を utils/server.ts から移動
 */
export const getCategoryPageUrl = (...categoryCodeList: string[]) => {
	const categoryPath = pagesPath.vona2._categoryCode(categoryCodeList).$url();
	return getUrlPath(categoryPath);
};

/**
 * Get maker category url
 * - dragon 実装を utils/server.ts から移動
 */
export const getMakerCategoryPageUrl = (
	brandCode: string,
	...categoryCodeList: string[]
) => {
	const makerCategoryPath = pagesPath.vona2.maker
		._brandCode(brandCode)
		._categoryCode(categoryCodeList)
		.$url();
	return getUrlPath(makerCategoryPath);
};

export type CategoryWithLevel = Category & { level: number };

export function createCategoryMap(category: Category, categoryLevel: number) {
	const result: Record<string, CategoryWithLevel> = {
		[category.categoryCode]: { ...category, level: 1 },
	};
	let level = 2;
	let children = category.childCategoryList;

	while (level < categoryLevel) {
		const nextChildren: Category[] = [];
		for (const child of children) {
			result[child.categoryCode] = { ...child, level };
			nextChildren.push(...child.childCategoryList);
		}
		level++;
		children = nextChildren;
	}
	return result;
}

export function findByCategoryCode(
	category: Category,
	categoryCode: string
): Category | null {
	if (category.categoryCode === categoryCode) {
		return category;
	}

	for (const child of category.childCategoryList) {
		const found = findByCategoryCode(child, categoryCode);
		if (found) {
			return found;
		}
	}
	return null;
}

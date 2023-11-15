import { TFunction } from 'i18next';
import { Breadcrumb } from '@/components/pc/ui/links/Breadcrumbs';
import {
	Brand,
	SearchBrandResponse,
} from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	SearchCategoryResponse,
	Category,
} from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { CategorySpec, getCategoryListFromRoot } from '@/utils/domain/category';
import { notEmpty, notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

export const alphabetList = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
] as const;
const notAlphabetGroupNameList = ['1-9'] as const;
const groupNameList = [...alphabetList, ...notAlphabetGroupNameList] as const;
export type Alphabet = typeof alphabetList[number];
type GroupName = typeof groupNameList[number];

export type BrandGroup = {
	groupName: GroupName;
	brandList: Brand[];
};

export type BrandBreadcrumbPayload = {
	brandResponse?: SearchBrandResponse;
	categoryCode?: string;
	categoryResponse?: SearchCategoryResponse;
	page?: number;
	categorySpec?: CategorySpec | null;
};

const characterPattern = /^[0-9A-Z]{1}$/;
const alphabetPattern = /^[A-Z]{1}$/;

export function getBrandGroupList(payload: {
	brandList: Brand[];
	/**
	 * Brand code list to refine brandList
	 * - set undefined not to refine
	 */
	brandCodeList?: string[];
}): BrandGroup[] {
	const { brandList, brandCodeList } = payload;
	const shouldRefine = brandCodeList != null && brandCodeList.length > 0;
	const targetBrandCodeSet = new Set(brandCodeList);
	const brandGroups: Record<string, BrandGroup> = {};

	brandList.forEach(brand => {
		if (shouldRefine && !targetBrandCodeSet.has(brand.brandCode)) {
			return;
		}

		const character = brand.brandIndexCharacter?.toUpperCase();
		if (character !== undefined && character.match(characterPattern)) {
			if (isAlphabet(character)) {
				updateBrandGroups({ brandGroups, brand, groupName: character });
			} else {
				updateBrandGroups({ brandGroups, brand, groupName: '1-9' });
			}
		}
	});

	return groupNameList.map(groupName => brandGroups[groupName]).filter(notNull);
}

function isAlphabet(character: string): character is Alphabet {
	return !!character.match(alphabetPattern);
}

function updateBrandGroups(payload: {
	brandGroups: Record<GroupName, BrandGroup>;
	brand: Brand;
	groupName: GroupName;
}) {
	const { brandGroups, brand, groupName } = payload;
	if (!brandGroups[groupName]) {
		brandGroups[groupName] = { groupName, brandList: [brand] };
	} else {
		brandGroups[groupName].brandList.push(brand);
	}
}

export function getBrandBreadcrumbList(
	t: TFunction,
	payload?: BrandBreadcrumbPayload
): Breadcrumb[] {
	// /maker
	const breadcrumbs: Breadcrumb[] = [
		{
			text: t('utils.domain.brand.brandList'),
		},
	];

	if (!payload) {
		return breadcrumbs;
	}

	const {
		brandResponse,
		categoryCode,
		categoryResponse,
		page = 1,
		categorySpec,
	} = payload;

	// /maker/misumi
	if (
		brandResponse &&
		notNull(brandResponse.brandList[0]) &&
		notNull(breadcrumbs[0])
	) {
		const brand = brandResponse.brandList[0];
		breadcrumbs[0].href = url.brandList;
		breadcrumbs.push({
			text: brand.brandName,
		});

		// /maker/misumi/mech
		if (
			categoryResponse &&
			notEmpty(categoryResponse.categoryList) &&
			notNull(breadcrumbs[1])
		) {
			breadcrumbs[1].href = url.brand(brand).default;

			const rootCategory = categoryResponse.categoryList[0];

			// /maker/misumi/mech/M0100000000
			if (rootCategory && categoryCode) {
				const categoryList = getCategoryListFromRoot(
					rootCategory,
					categoryCode
				);
				const currentCategory = categoryList.pop();

				categoryList.forEach((category, index) => {
					breadcrumbs.push({
						text: category.categoryName,
						href: url
							.brand(brand)
							.category(
								...categoryList
									.slice(0, index)
									.map(({ categoryCode }) => categoryCode),
								category.categoryCode
							)(),
					});
				});

				const breadcrumbListWithSpecSearch =
					getBreadcrumbListWithSpecSearchForBrand({
						categoryList,
						currentCategory,
						page,
						categorySpec,
						brand,
						t,
					});

				breadcrumbs.push(...breadcrumbListWithSpecSearch);
			}
		}
	}

	return breadcrumbs;
}

export function getBreadcrumbListWithSpecSearchForBrand(payload: {
	categoryList: Category[];
	currentCategory?: Category;
	page: number;
	categorySpec?: CategorySpec | null;
	brand: Brand;
	t: TFunction;
}): Breadcrumb[] {
	const { categoryList, currentCategory, page, categorySpec, brand, t } =
		payload;
	const breadcrumbs: Breadcrumb[] = [];

	if (!currentCategory) {
		return [];
	}

	if (categorySpec || page > 1) {
		// Current category
		breadcrumbs.push({
			text: currentCategory.categoryName,
			href: url
				.brand(brand)
				.category(
					...categoryList.map(({ categoryCode }) => categoryCode),
					currentCategory.categoryCode
				)(),
		});

		if (categorySpec && page > 1) {
			// Category spec
			breadcrumbs.push({
				text: `${categorySpec.spec.specName}:${categorySpec.specValue.specValueDisp}`,
				href: url.brand(brand).fromSpecSearch(
					{
						CategorySpec: `${categorySpec.spec.specCode}::${categorySpec.specValue.specValue}`,
					},
					...categoryList.map(({ categoryCode }) => categoryCode),
					currentCategory.categoryCode
				),
			});

			// Page
			breadcrumbs.push({
				text: t('utils.domain.brand.titlePage', {
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
				text: t('utils.domain.brand.titlePage', {
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

/** Misumi brand code */
export const MISUMI = 'MSM1';

/** Check Misumi brand */
export function isMisumi(brand: { brandCode: string }): boolean {
	return brand.brandCode === MISUMI;
}

/** Check not Misumi brand */
export function notMisumi(brand: { brandCode: string }): boolean {
	return !isMisumi(brand);
}
